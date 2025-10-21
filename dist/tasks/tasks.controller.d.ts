import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
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
    findAll(req: any, query: TaskQueryDto): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateTaskDto: UpdateTaskDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        title: string;
        description: string | null;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        projectId: number;
        assigneeId: number | null;
    }>;
    toggleComplete(req: any, id: string): Promise<{
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
    assignTask(req: any, id: string, assigneeId: string): Promise<{
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
    unassignTask(req: any, id: string): Promise<{
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
    findAllAdmin(query: TaskQueryDto): Promise<{
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
}
