import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: number, dto: CreateTaskDto): Promise<{
        project: {
            id: number;
            name: string;
            owner: {
                id: number;
                email: string;
            };
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    findAll(userId: number, query: TaskQueryDto): Promise<{
        data: ({
            project: {
                id: number;
                name: string;
                owner: {
                    id: number;
                    email: string;
                };
            };
            assignee: {
                id: number;
                email: string;
            } | null;
        } & {
            title: string;
            description: string | null;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            projectId: number;
            assigneeId: number | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: number, id: number): Promise<{
        project: {
            owner: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            name: string;
            ownerId: number;
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    update(userId: number, id: number, dto: UpdateTaskDto): Promise<{
        project: {
            id: number;
            name: string;
            owner: {
                id: number;
                email: string;
            };
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    remove(userId: number, id: number): Promise<{
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    toggleComplete(userId: number, id: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    assignTask(userId: number, id: number, assigneeId: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    unassignTask(userId: number, id: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            id: number;
            email: string;
        } | null;
    } & {
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    private validateTaskOwnership;
}
