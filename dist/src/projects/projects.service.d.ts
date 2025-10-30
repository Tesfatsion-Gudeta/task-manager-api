import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, ProjectQueryDto, UpdateProjectDto, ProjectsListResponseDto, ProjectResponseDto } from './dto';
import { Project } from '@prisma/client';
import { RedisCacheService } from '../redis/redis-cache.service';
export declare class ProjectsService {
    private prisma;
    private redisCacheService;
    constructor(prisma: PrismaService, redisCacheService: RedisCacheService);
    private getProjectCacheKey;
    private getProjectsListCacheKey;
    createProject(userId: number, dto: CreateProjectDto): Promise<Project>;
    findAll(userId: number, query: ProjectQueryDto): Promise<ProjectsListResponseDto>;
    findOne(userId: number, id: number): Promise<ProjectResponseDto>;
    update(userId: number, id: number, dto: UpdateProjectDto): Promise<Project>;
    remove(userId: number, id: number): Promise<Project>;
    private validateOwnership;
}
