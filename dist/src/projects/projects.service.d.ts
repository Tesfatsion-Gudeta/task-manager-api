import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, ProjectQueryDto, UpdateProjectDto, ProjectsListResponseDto, ProjectResponseDto } from './dto';
import { Project } from '@prisma/client';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProject(userId: number, dto: CreateProjectDto): Promise<Project>;
    findAll(userId: number, query: ProjectQueryDto): Promise<ProjectsListResponseDto>;
    findOne(userId: number, id: number): Promise<ProjectResponseDto>;
    update(userId: number, id: number, dto: UpdateProjectDto): Promise<Project>;
    remove(userId: number, id: number): Promise<Project>;
    private validateOwnership;
}
