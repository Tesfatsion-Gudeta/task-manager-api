export declare class TaskQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'title' | 'completed' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    completed?: boolean;
    projectId?: number;
    assigneeId?: number;
}
