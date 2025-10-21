import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    findAll(req: any, query: TaskQueryDto): Promise<{
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
    findOne(req: any, id: string): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    update(req: any, id: string, updateTaskDto: UpdateTaskDto): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    remove(req: any, id: string): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    toggleComplete(req: any, id: string): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    assignTask(req: any, id: string, assigneeId: string): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    unassignTask(req: any, id: string): Promise<{
        title: string;
        completed: boolean;
        createdAt: Date;
        id: number;
        projectId: number;
    }>;
    findAllAdmin(query: TaskQueryDto): Promise<{
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
}
