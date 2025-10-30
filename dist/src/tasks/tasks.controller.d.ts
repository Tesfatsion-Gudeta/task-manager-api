import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto, TasksListResponseDto, TaskResponseDto } from './dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(userId: number, createTaskDto: CreateTaskDto): Promise<TaskResponseDto>;
    findAll(userId: number, query: TaskQueryDto): Promise<TasksListResponseDto>;
    findOne(userId: number, id: number): Promise<TaskResponseDto>;
    update(userId: number, id: number, dto: UpdateTaskDto): Promise<TaskResponseDto>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    toggleComplete(userId: number, id: number): Promise<TaskResponseDto>;
    assignTask(userId: number, id: number, assigneeId: number): Promise<TaskResponseDto>;
    unassignTask(userId: number, id: number): Promise<TaskResponseDto>;
    findAllAdmin(query: TaskQueryDto): Promise<TasksListResponseDto>;
}
