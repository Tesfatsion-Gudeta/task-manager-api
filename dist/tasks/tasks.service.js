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
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        return this.prisma.task.create({
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
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
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
    }
    async findAll(userId, query) {
        const { page, limit, search, sortBy, sortOrder, completed, projectId, assigneeId, } = query;
        const pageSafe = page ?? 1;
        const limitSafe = limit ?? 10;
        const skip = (pageSafe - 1) * limitSafe;
        const where = {
            project: {
                ownerId: userId,
            },
        };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (completed !== undefined) {
            where.completed = completed;
        }
        if (projectId) {
            where.projectId = projectId;
        }
        if (assigneeId) {
            where.assigneeId = assigneeId;
        }
        let orderBy;
        switch (sortBy) {
            case 'title':
                orderBy = { title: sortOrder };
                break;
            case 'completed':
                orderBy = { completed: sortOrder };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: sortOrder };
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
                            owner: {
                                select: {
                                    id: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.task.count({ where }),
        ]);
        return {
            data: tasks,
            meta: {
                page: pageSafe,
                limit: limitSafe,
                total,
                totalPages: Math.ceil(total / limitSafe),
            },
        };
    }
    async findOne(userId, id) {
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
        return task;
    }
    async update(userId, id, dto) {
        await this.validateTaskOwnership(userId, id);
        if (dto.projectId) {
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
        return this.prisma.task.update({
            where: { id },
            data: dto,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
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
    }
    async remove(userId, id) {
        await this.validateTaskOwnership(userId, id);
        return this.prisma.task.delete({
            where: { id },
        });
    }
    async toggleComplete(userId, id) {
        await this.validateTaskOwnership(userId, id);
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        return this.prisma.task.update({
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
    }
    async assignTask(userId, id, assigneeId) {
        await this.validateTaskOwnership(userId, id);
        const assignee = await this.prisma.user.findUnique({
            where: { id: assigneeId },
        });
        if (!assignee) {
            throw new common_1.BadRequestException('Assignee not found');
        }
        return this.prisma.task.update({
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
    }
    async unassignTask(userId, id) {
        await this.validateTaskOwnership(userId, id);
        return this.prisma.task.update({
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
    }
    async validateTaskOwnership(userId, taskId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.project.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only modify tasks in your own projects');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map