declare class ProjectAssigneeResponseDto {
    id: number;
    email: string;
}
declare class ProjectTaskResponseDto {
    id: number;
    title: string;
    completed: boolean;
    assignee?: ProjectAssigneeResponseDto;
}
declare class ProjectOwnerResponseDto {
    id: number;
    email: string;
}
export declare class ProjectResponseDto {
    id: number;
    name: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
    tasks?: ProjectTaskResponseDto[];
    owner?: ProjectOwnerResponseDto;
}
export declare class ProjectsListResponseDto {
    data: ProjectResponseDto[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export {};
