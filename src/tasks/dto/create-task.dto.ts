import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Optional description of the task' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID of the project this task belongs to' })
  @IsNumber()
  projectId: number;

  @ApiPropertyOptional({
    description: 'ID of the assignee (user) for the task',
  })
  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
