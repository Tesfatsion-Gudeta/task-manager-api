declare class TaskOwnerResponseDto {
    id: number;
    email: string;
}
declare class TaskProjectResponseDto {
    id: number;
    name: string;
    owner: TaskOwnerResponseDto;
}
declare class TaskAssigneeResponseDto {
    id: number;
    email: string;
}
export declare class TaskResponseDto {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    projectId: number;
    assigneeId?: number;
    createdAt: Date;
    updatedAt: Date;
    project: TaskProjectResponseDto;
    assignee?: TaskAssigneeResponseDto;
}
export declare class TasksListResponseDto {
    data: TaskResponseDto[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export {};
