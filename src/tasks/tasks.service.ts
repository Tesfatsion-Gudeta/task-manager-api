import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  TaskResponseDto,
  TasksListResponseDto,
} from './dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    userId: number,
    dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: { owner: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only create tasks in your own projects',
      );
    }

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new BadRequestException('Assignee not found');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        assigneeId: dto.assigneeId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            owner: { select: { id: true, email: true } },
          },
        },
        assignee: { select: { id: true, email: true } },
      },
    });

    console.log(`Created task ${task.id}`);
    return task as unknown as TaskResponseDto;
  }

  async findAll(
    userId: number,
    query: TaskQueryDto,
    isAdmin = false,
  ): Promise<TasksListResponseDto> {
    console.log(`Fetching tasks from database for user ${userId}`);

    const pageSafe = Number(query.page ?? 1);
    const limitSafe = Number(query.limit ?? 10);
    const skip = (pageSafe - 1) * limitSafe;

    const { search, sortBy, sortOrder, completed, projectId, assigneeId } =
      query;

    const where: any = {};
    if (!isAdmin) {
      where.project = { ownerId: userId };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (completed !== undefined) where.completed = completed;
    if (projectId !== undefined) where.projectId = Number(projectId);
    if (assigneeId !== undefined) where.assigneeId = Number(assigneeId);

    let orderBy: any;
    switch (sortBy) {
      case 'title':
        orderBy = { title: sortOrder ?? 'asc' };
        break;
      case 'completed':
        orderBy = { completed: sortOrder ?? 'asc' };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder ?? 'desc' };
        break;
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limitSafe,
        orderBy,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              owner: { select: { id: true, email: true } },
            },
          },
          assignee: { select: { id: true, email: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const result: TasksListResponseDto = {
      data: tasks as unknown as TaskResponseDto[],
      meta: {
        page: pageSafe,
        limit: limitSafe,
        total,
        totalPages: Math.ceil(total / limitSafe),
      },
    };

    return result;
  }

  async findOne(userId: number, id: number): Promise<TaskResponseDto> {
    console.log(`Fetching task ${id} from database`);

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            owner: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task as unknown as TaskResponseDto;
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.validateTaskOwnership(userId, id);

    if (dto.projectId && dto.projectId !== task.projectId) {
      const newProject = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });

      if (!newProject) {
        throw new NotFoundException('Project not found');
      }

      if (newProject.ownerId !== userId) {
        throw new ForbiddenException(
          'You can only move tasks to your own projects',
        );
      }
    }

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new BadRequestException('Assignee not found');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: dto,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            owner: { select: { id: true, email: true } },
          },
        },
        assignee: { select: { id: true, email: true } },
      },
    });

    console.log(`Updated task ${id}`);
    return updatedTask as unknown as TaskResponseDto;
  }

  async remove(userId: number, id: number): Promise<{ message: string }> {
    const task = await this.validateTaskOwnership(userId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    console.log(`Deleted task ${id}`);
    return { message: 'Task deleted successfully' };
  }

  async toggleComplete(userId: number, id: number): Promise<TaskResponseDto> {
    const task = await this.validateTaskOwnership(userId, id);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    console.log(`Toggled completion for task ${id}`);
    return updatedTask as unknown as TaskResponseDto;
  }

  async assignTask(
    userId: number,
    id: number,
    assigneeId: number,
  ): Promise<TaskResponseDto> {
    const task = await this.validateTaskOwnership(userId, id);

    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
    });

    if (!assignee) {
      throw new BadRequestException('Assignee not found');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { assigneeId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    console.log(`Assigned task ${id} to user ${assigneeId}`);
    return updatedTask as unknown as TaskResponseDto;
  }

  async unassignTask(userId: number, id: number): Promise<TaskResponseDto> {
    const task = await this.validateTaskOwnership(userId, id);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { assigneeId: null },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    console.log(`Unassigned task ${id}`);
    return updatedTask as unknown as TaskResponseDto;
  }

  private async validateTaskOwnership(
    userId: number,
    taskId: number,
  ): Promise<Task & { project: { ownerId: number } }> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only modify tasks in your own projects',
      );
    }

    return task;
  }
}
