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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    findAll(req: any, query: TaskQueryDto): Promise<{
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
            title: string;
            description: string | null;
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
    findOne(req: any, id: string): Promise<{
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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    update(req: any, id: string, updateTaskDto: UpdateTaskDto): Promise<{
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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    remove(req: any, id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    toggleComplete(req: any, id: string): Promise<{
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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    assignTask(req: any, id: string, assigneeId: string): Promise<{
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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    unassignTask(req: any, id: string): Promise<{
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
        title: string;
        description: string | null;
        completed: boolean;
        projectId: number;
        assigneeId: number | null;
    }>;
    findAllAdmin(query: TaskQueryDto): Promise<{
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
            title: string;
            description: string | null;
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
}
