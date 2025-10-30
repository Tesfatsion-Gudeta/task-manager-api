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
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  TasksListResponseDto,
  TaskResponseDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorators';
import { Roles } from '../common/decorators/roles.decorators';
import { Role } from '@prisma/client';

@ApiTags('Tasks')
@ApiBearerAuth('access_token')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task in a project' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User cannot create tasks in projects they do not own',
  })
  create(
    @GetUser('id') userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks for the authenticated user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['title', 'completed', 'createdAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'completed', required: false, type: Boolean })
  @ApiQuery({ name: 'projectId', required: false, type: Number })
  @ApiQuery({ name: 'assigneeId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of tasks',
    type: TasksListResponseDto,
  })
  findAll(
    @GetUser('id') userId: number,
    @Query() query: TaskQueryDto,
  ): Promise<TasksListResponseDto> {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single task by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested task',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Cannot modify tasks outside user projects',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete tasks outside user projects',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(userId, id);
  }

  @Post(':id/toggle-complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle the completion status of a task' })
  @ApiResponse({
    status: 200,
    description: 'Task completion status toggled',
    type: TaskResponseDto,
  })
  toggleComplete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskResponseDto> {
    return this.tasksService.toggleComplete(userId, id);
  }

  @Post(':id/assign/:assigneeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({
    status: 200,
    description: 'Task assigned successfully',
    type: TaskResponseDto,
  })
  assignTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ): Promise<TaskResponseDto> {
    return this.tasksService.assignTask(userId, id, assigneeId);
  }

  @Post(':id/unassign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unassign a task' })
  @ApiResponse({
    status: 200,
    description: 'Task unassigned successfully',
    type: TaskResponseDto,
  })
  unassignTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskResponseDto> {
    return this.tasksService.unassignTask(userId, id);
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Retrieve all tasks across all projects' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of all tasks for admins',
    type: TasksListResponseDto,
  })
  findAllAdmin(@Query() query: TaskQueryDto): Promise<TasksListResponseDto> {
    return this.tasksService.findAll(0, query, true);
  }
}
