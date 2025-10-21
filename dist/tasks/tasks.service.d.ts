import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: number, dto: CreateTaskDto): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    findAll(userId: number, query: TaskQueryDto): Promise<{
        data: {
            title: string;
            completed: boolean;
            createdAt: Date;
            id: number;
            projectId: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: number, id: number): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    update(userId: number, id: number, dto: UpdateTaskDto): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    toggleComplete(userId: number, id: number): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    assignTask(userId: number, id: number, assigneeId: number): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    unassignTask(userId: number, id: number): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    private validateTaskOwnership;
}
