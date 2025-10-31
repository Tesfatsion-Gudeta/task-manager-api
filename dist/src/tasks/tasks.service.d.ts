import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto, TaskResponseDto, TasksListResponseDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: number, dto: CreateTaskDto): Promise<TaskResponseDto>;
    findAll(userId: number, query: TaskQueryDto, isAdmin?: boolean): Promise<TasksListResponseDto>;
    findOne(userId: number, id: number): Promise<TaskResponseDto>;
    update(userId: number, id: number, dto: UpdateTaskDto): Promise<TaskResponseDto>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    toggleComplete(userId: number, id: number): Promise<TaskResponseDto>;
    assignTask(userId: number, id: number, assigneeId: number): Promise<TaskResponseDto>;
    unassignTask(userId: number, id: number): Promise<TaskResponseDto>;
    private validateTaskOwnership;
}
