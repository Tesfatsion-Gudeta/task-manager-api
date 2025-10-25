import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Website Redesign',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
