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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_cache_service_1 = require("../redis/redis-cache.service");
let ProjectsService = class ProjectsService {
    prisma;
    redisCacheService;
    constructor(prisma, redisCacheService) {
        this.prisma = prisma;
        this.redisCacheService = redisCacheService;
    }
    getProjectCacheKey(projectId) {
        return `project:${projectId}`;
    }
    getProjectsListCacheKey(userId, query) {
        const queryString = JSON.stringify({
            page: query.page,
            limit: query.limit,
            search: query.search,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
        const queryHash = Buffer.from(queryString).toString('base64url');
        return `projects:user:${userId}:${queryHash}`;
    }
    async createProject(userId, dto) {
        const project = await this.prisma.project.create({
            data: {
                name: dto.name,
                ownerId: userId,
            },
        });
        console.log(`🆕 Created project ${project.id} - lists will auto-expire`);
        return project;
    }
    async findAll(userId, query) {
        const cacheKey = this.getProjectsListCacheKey(userId, query);
        const cachedProjects = await this.redisCacheService.get(cacheKey);
        if (cachedProjects !== undefined) {
            console.log(`✅ Serving projects list from cache for user ${userId}`);
            return cachedProjects;
        }
        console.log(`🔍 Fetching projects from database for user ${userId}`);
        const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, limit);
        const skip = (sanitizedPage - 1) * sanitizedLimit;
        const where = {
            ownerId: userId,
            ...(search && {
                name: {
                    contains: search,
                },
            }),
        };
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                skip,
                take: sanitizedLimit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
                include: {
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            completed: true,
                        },
                    },
                },
            }),
            this.prisma.project.count({ where }),
        ]);
        const result = {
            data: projects,
            meta: {
                page: sanitizedPage,
                limit: sanitizedLimit,
                total,
                totalPages: Math.ceil(total / sanitizedLimit),
            },
        };
        await this.redisCacheService.set(cacheKey, result, 300);
        console.log(`💾 Cached projects list for user ${userId} (5min TTL)`);
        return result;
    }
    async findOne(userId, id) {
        const cacheKey = this.getProjectCacheKey(id);
        const cachedProject = await this.redisCacheService.get(cacheKey);
        if (cachedProject !== undefined) {
            console.log(`✅ Serving project ${id} from cache`);
            if (cachedProject.ownerId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return cachedProject;
        }
        console.log(`🔍 Fetching project ${id} from database`);
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                tasks: {
                    include: {
                        assignee: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.redisCacheService.set(cacheKey, project, 3600);
        console.log(`💾 Cached project ${id} (1hr TTL)`);
        return project;
    }
    async update(userId, id, dto) {
        await this.validateOwnership(userId, id);
        const updatedProject = await this.prisma.project.update({
            where: { id },
            data: dto,
        });
        await this.redisCacheService.del(this.getProjectCacheKey(id));
        console.log(`🗑️ Invalidated cache for updated project ${id}`);
        return updatedProject;
    }
    async remove(userId, id) {
        await this.validateOwnership(userId, id);
        const deletedProject = await this.prisma.project.delete({
            where: { id },
        });
        await this.redisCacheService.del(this.getProjectCacheKey(id));
        console.log(`🗑️ Invalidated cache for deleted project ${id}`);
        return deletedProject;
    }
    async validateOwnership(userId, projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_cache_service_1.RedisCacheService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map