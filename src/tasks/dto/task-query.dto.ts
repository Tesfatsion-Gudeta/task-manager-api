import {
  IsOptional,
  IsIn,
  IsNumber,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TaskQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['title', 'completed', 'createdAt'])
  sortBy?: 'title' | 'completed' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assigneeId?: number;
}
