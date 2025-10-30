import { ApiProperty } from '@nestjs/swagger';

// Use unique names for helper DTOs
class ProjectAssigneeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}
class ProjectTaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty({ required: false })
  assignee?: ProjectAssigneeResponseDto;
}

class ProjectOwnerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [ProjectTaskResponseDto], required: false })
  tasks?: ProjectTaskResponseDto[];

  @ApiProperty({ type: () => ProjectOwnerResponseDto, required: false })
  owner?: ProjectOwnerResponseDto;
}

export class ProjectsListResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  data: ProjectResponseDto[];

  @ApiProperty()
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
