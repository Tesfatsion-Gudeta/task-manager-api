import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProject(userId: number, dto: CreateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    findAll(userId: number, query: ProjectQueryDto): Promise<{
        data: ({
            tasks: {
                id: number;
                title: string;
                completed: boolean;
            }[];
        } & {
            id: number;
            name: string;
            createdAt: Date;
            ownerId: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    update(userId: number, id: number, dto: UpdateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    private validateOwnership;
}
