import { ApiProperty } from '@nestjs/swagger';

// Use unique names for helper DTOs
class TaskOwnerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}
class TaskProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => TaskOwnerResponseDto })
  owner: TaskOwnerResponseDto;
}

class TaskAssigneeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  projectId: number;

  @ApiProperty({ required: false })
  assigneeId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => TaskProjectResponseDto })
  project: TaskProjectResponseDto;

  @ApiProperty({ type: () => TaskAssigneeResponseDto, required: false })
  assignee?: TaskAssigneeResponseDto;
}

export class TasksListResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty()
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
