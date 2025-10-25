import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: number, dto: CreateTaskDto) {
    // Verify the project exists and user owns it
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

    // If assigneeId is provided, verify the user exists
    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new BadRequestException('Assignee not found');
      }
    }

    return this.prisma.task.create({
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
            owner: {
              select: {
                id: true,
                email: true,
              },
            },
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
  }

  async findAll(userId: number, query: TaskQueryDto, isAdmin = false) {
    const pageSafe = Number(query.page ?? 1);
    const limitSafe = Number(query.limit ?? 10);
    const skip = (pageSafe - 1) * limitSafe;

    const { search, sortBy, sortOrder, completed, projectId, assigneeId } =
      query;

    // Build where clause
    const where: any = {};

    // Only filter by project owner if not admin
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

    // Order by
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

    return {
      data: tasks,
      meta: {
        page: pageSafe,
        limit: limitSafe,
        total,
        totalPages: Math.ceil(total / limitSafe),
      },
    };
  }

  async findOne(userId: number, id: number) {
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

    // Check if user owns the project that contains this task
    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    await this.validateTaskOwnership(userId, id);

    // If changing project, verify ownership of new project
    if (dto.projectId) {
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

    // If changing assignee, verify the user exists
    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new BadRequestException('Assignee not found');
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                email: true,
              },
            },
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
  }

  async remove(userId: number, id: number) {
    await this.validateTaskOwnership(userId, id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async toggleComplete(userId: number, id: number) {
    await this.validateTaskOwnership(userId, id);

    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
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
  }

  async assignTask(userId: number, id: number, assigneeId: number) {
    await this.validateTaskOwnership(userId, id);

    // Verify assignee exists
    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
    });

    if (!assignee) {
      throw new BadRequestException('Assignee not found');
    }

    return this.prisma.task.update({
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
  }

  async unassignTask(userId: number, id: number) {
    await this.validateTaskOwnership(userId, id);

    return this.prisma.task.update({
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
  }

  private async validateTaskOwnership(userId: number, taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
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
  }
}
