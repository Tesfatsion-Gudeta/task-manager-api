import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
  ProjectsListResponseDto,
  ProjectResponseDto,
} from './dto';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });

    console.log(`Created project ${project.id}`);
    return project;
  }

  async findAll(
    userId: number,
    query: ProjectQueryDto,
  ): Promise<ProjectsListResponseDto> {
    console.log(`Fetching projects from database for user ${userId}`);

    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
    const sanitizedPage = Math.max(1, page);
    const sanitizedLimit = Math.max(1, limit);
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const where = {
      ownerId: userId,
      ...(search && {
        name: {
          contains: search,
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

    const result: ProjectsListResponseDto = {
      data: projects as ProjectResponseDto[],
      meta: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total,
        totalPages: Math.ceil(total / sanitizedLimit),
      },
    };

    return result;
  }

  async findOne(userId: number, id: number): Promise<ProjectResponseDto> {
    console.log(`Fetching project ${id} from database`);

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

    return project as ProjectResponseDto;
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    await this.validateOwnership(userId, id);

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    console.log(`Updated project ${id}`);
    return updatedProject;
  }

  async remove(userId: number, id: number): Promise<Project> {
    await this.validateOwnership(userId, id);

    const deletedProject = await this.prisma.project.delete({
      where: { id },
    });

    console.log(`Deleted project ${id}`);
    return deletedProject;
  }

  private async validateOwnership(
    userId: number,
    projectId: number,
  ): Promise<void> {
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