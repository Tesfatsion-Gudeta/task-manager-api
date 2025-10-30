"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_cache_service_1 = require("../redis/redis-cache.service");
let TasksService = class TasksService {
    prisma;
    redisCacheService;
    constructor(prisma, redisCacheService) {
        this.prisma = prisma;
        this.redisCacheService = redisCacheService;
    }
    getTaskCacheKey(taskId) {
        return `task:${taskId}`;
    }
    getTasksListCacheKey(userId, query) {
        const queryString = JSON.stringify({
            page: query.page,
            limit: query.limit,
            search: query.search,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            completed: query.completed,
            projectId: query.projectId,
            assigneeId: query.assigneeId,
        });
        const queryHash = Buffer.from(queryString).toString('base64url');
        return `tasks:user:${userId}:${queryHash}`;
    }
    async createTask(userId, dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: dto.projectId },
            include: { owner: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only create tasks in your own projects');
        }
        if (dto.assigneeId) {
            const assignee = await this.prisma.user.findUnique({
                where: { id: dto.assigneeId },
            });
            if (!assignee) {
                throw new common_1.BadRequestException('Assignee not found');
            }
        }
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                projectId: dto.projectId,
                assigneeId: dto.assigneeId,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        owner: { select: { id: true, email: true } },
                    },
                },
                assignee: { select: { id: true, email: true } },
            },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(dto.projectId));
        console.log(`🆕 Created task ${task.id} - related caches invalidated`);
        return task;
    }
    async findAll(userId, query, isAdmin = false) {
        const cacheKey = this.getTasksListCacheKey(userId, query);
        const cachedTasks = await this.redisCacheService.get(cacheKey);
        if (cachedTasks !== undefined) {
            console.log(`✅ Serving tasks list from cache for user ${userId}`);
            return cachedTasks;
        }
        console.log(`🔍 Fetching tasks from database for user ${userId}`);
        const pageSafe = Number(query.page ?? 1);
        const limitSafe = Number(query.limit ?? 10);
        const skip = (pageSafe - 1) * limitSafe;
        const { search, sortBy, sortOrder, completed, projectId, assigneeId } = query;
        const where = {};
        if (!isAdmin) {
            where.project = { ownerId: userId };
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        if (completed !== undefined)
            where.completed = completed;
        if (projectId !== undefined)
            where.projectId = Number(projectId);
        if (assigneeId !== undefined)
            where.assigneeId = Number(assigneeId);
        let orderBy;
        switch (sortBy) {
            case 'title':
                orderBy = { title: sortOrder ?? 'asc' };
                break;
            case 'completed':
                orderBy = { completed: sortOrder ?? 'asc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: sortOrder ?? 'desc' };
                break;
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take: limitSafe,
                orderBy,
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            owner: { select: { id: true, email: true } },
                        },
                    },
                    assignee: { select: { id: true, email: true } },
                },
            }),
            this.prisma.task.count({ where }),
        ]);
        const result = {
            data: tasks,
            meta: {
                page: pageSafe,
                limit: limitSafe,
                total,
                totalPages: Math.ceil(total / limitSafe),
            },
        };
        await this.redisCacheService.set(cacheKey, result, 300);
        console.log(`💾 Cached tasks list for user ${userId} (5min TTL)`);
        return result;
    }
    async findOne(userId, id) {
        const cacheKey = this.getTaskCacheKey(id);
        const cachedTask = await this.redisCacheService.get(cacheKey);
        if (cachedTask !== undefined) {
            console.log(`✅ Serving task ${id} from cache`);
            if (cachedTask.project.owner.id !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return cachedTask;
        }
        console.log(`🔍 Fetching task ${id} from database`);
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                project: {
                    include: {
                        owner: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.project.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.redisCacheService.set(cacheKey, task, 3600);
        console.log(`💾 Cached task ${id} (1hr TTL)`);
        return task;
    }
    async update(userId, id, dto) {
        const task = await this.validateTaskOwnership(userId, id);
        if (dto.projectId && dto.projectId !== task.projectId) {
            const newProject = await this.prisma.project.findUnique({
                where: { id: dto.projectId },
            });
            if (!newProject) {
                throw new common_1.NotFoundException('Project not found');
            }
            if (newProject.ownerId !== userId) {
                throw new common_1.ForbiddenException('You can only move tasks to your own projects');
            }
        }
        if (dto.assigneeId) {
            const assignee = await this.prisma.user.findUnique({
                where: { id: dto.assigneeId },
            });
            if (!assignee) {
                throw new common_1.BadRequestException('Assignee not found');
            }
        }
        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: dto,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        owner: { select: { id: true, email: true } },
                    },
                },
                assignee: { select: { id: true, email: true } },
            },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(id));
        console.log(`🗑️ Invalidated cache for updated task ${id}`);
        return updatedTask;
    }
    async remove(userId, id) {
        const task = await this.validateTaskOwnership(userId, id);
        await this.prisma.task.delete({
            where: { id },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(id));
        console.log(`🗑️ Invalidated cache for deleted task ${id}`);
        return { message: 'Task deleted successfully' };
    }
    async toggleComplete(userId, id) {
        const task = await this.validateTaskOwnership(userId, id);
        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: { completed: !task.completed },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(id));
        console.log(`🗑️ Invalidated cache for toggled task ${id}`);
        return updatedTask;
    }
    async assignTask(userId, id, assigneeId) {
        const task = await this.validateTaskOwnership(userId, id);
        const assignee = await this.prisma.user.findUnique({
            where: { id: assigneeId },
        });
        if (!assignee) {
            throw new common_1.BadRequestException('Assignee not found');
        }
        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: { assigneeId },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(id));
        console.log(`🗑️ Invalidated cache for assigned task ${id}`);
        return updatedTask;
    }
    async unassignTask(userId, id) {
        const task = await this.validateTaskOwnership(userId, id);
        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: { assigneeId: null },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        await this.redisCacheService.del(this.getTaskCacheKey(id));
        console.log(`🗑️ Invalidated cache for unassigned task ${id}`);
        return updatedTask;
    }
    async validateTaskOwnership(userId, taskId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.project.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only modify tasks in your own projects');
        }
        return task;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_cache_service_1.RedisCacheService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map