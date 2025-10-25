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
                email: string;
                id: number;
            };
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    findAll(userId: number, query: TaskQueryDto, isAdmin?: boolean): Promise<{
        data: ({
            project: {
                id: number;
                name: string;
                owner: {
                    email: string;
                    id: number;
                };
            };
            assignee: {
                email: string;
                id: number;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
            title: string;
            completed: boolean;
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
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            name: string;
            ownerId: number;
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    update(userId: number, id: number, dto: UpdateTaskDto): Promise<{
        project: {
            id: number;
            name: string;
            owner: {
                email: string;
                id: number;
            };
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    remove(userId: number, id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    toggleComplete(userId: number, id: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    assignTask(userId: number, id: number, assigneeId: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    unassignTask(userId: number, id: number): Promise<{
        project: {
            id: number;
            name: string;
        };
        assignee: {
            email: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        title: string;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    private validateTaskOwnership;
}
