import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: number, query: ProjectQueryDto) {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
    const sanitizedPage = Math.max(1, page);
    const sanitizedLimit = Math.max(1, limit);
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const where = {
      ownerId: userId,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: sanitizedLimit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              completed: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      meta: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total,
        totalPages: Math.ceil(total / sanitizedLimit),
      },
    };
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(userId: number, id: number, dto: UpdateProjectDto) {
    await this.validateOwnership(userId, id);

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: number, id: number) {
    await this.validateOwnership(userId, id);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  private async validateOwnership(userId: number, projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
  }
}
