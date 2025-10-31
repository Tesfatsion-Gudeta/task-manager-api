import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
  ProjectsListResponseDto, // Import the DTO
} from './dto';
import { GetUser } from '../common/decorators/get-user.decorators';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth('access_token')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign',
        ownerId: 1,
        createdAt: '2025-10-25T13:00:00.000Z',
        updatedAt: '2025-10-25T13:00:00.000Z',
      },
    },
  })
  async create(
    @GetUser('id') userId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(userId, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for the logged-in user' })
  @ApiResponse({
    status: 200,
    type: ProjectsListResponseDto, // Use the DTO type directly!
  })
  async findAll(
    @GetUser('id') userId: number,
    @Query() query: ProjectQueryDto,
  ): Promise<ProjectsListResponseDto> {
    return this.projectsService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Project found',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign',
        ownerId: 1,
        tasks: [{ id: 1, title: 'Landing page', completed: false }],
        createdAt: '2025-10-25T13:00:00.000Z',
        updatedAt: '2025-10-25T13:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.remove(userId, id);
  }
}
