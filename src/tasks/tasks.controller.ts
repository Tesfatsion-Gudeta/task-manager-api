import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorators';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.id, createTaskDto);
  }

  @Get()
  findAll(@Request() req, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.user.id, +id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, +id);
  }

  @Post(':id/toggle-complete')
  @HttpCode(HttpStatus.OK)
  toggleComplete(@Request() req, @Param('id') id: string) {
    return this.tasksService.toggleComplete(req.user.id, +id);
  }

  @Post(':id/assign/:assigneeId')
  @HttpCode(HttpStatus.OK)
  assignTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.tasksService.assignTask(userId, id, assigneeId);
  }

  @Post(':id/unassign')
  @HttpCode(HttpStatus.OK)
  unassignTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.unassignTask(userId, id);
  }

  // Admin only routes
  @Get('admin/all')
  @Roles(Role.ADMIN)
  findAllAdmin(@Query() query: TaskQueryDto) {
    // Admin can see all tasks across all projects
    // You would need to modify the service method for this
    return this.tasksService.findAll(0, query); // Using 0 as a bypass for admin
  }
}
