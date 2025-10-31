import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
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
import { RedisCacheService } from '../redis/redis-cache.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private redisCacheService: RedisCacheService,
  ) {}

  // Cache key generators
  private getProjectCacheKey(projectId: number): string {
    return `project:${projectId}`;
  }

  private getProjectsListCacheKey(
    userId: number,
    query: ProjectQueryDto,
  ): string {
    const queryString = JSON.stringify({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
    const queryHash = Buffer.from(queryString).toString('base64url');
    return `projects:user:${userId}:${queryHash}`;
  }

  async createProject(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });

    console.log(`Created project ${project.id} - lists will auto-expire`);
    return project;
  }

  async findAll(
    userId: number,
    query: ProjectQueryDto,
  ): Promise<ProjectsListResponseDto> {
    const cacheKey = this.getProjectsListCacheKey(userId, query);

    const cachedProjects =
      await this.redisCacheService.get<ProjectsListResponseDto>(cacheKey);

    //returning from cache if available
    if (cachedProjects !== undefined) {
      console.log(` Serving projects list from cache for user ${userId}`);
      return cachedProjects;
    }

    console.log(` Fetching projects from database for user ${userId}`);

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

    // The response automatically matches our DTO structure
    const result: ProjectsListResponseDto = {
      data: projects as ProjectResponseDto[], // Type assertion if needed
      meta: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total,
        totalPages: Math.ceil(total / sanitizedLimit),
      },
    };

    await this.redisCacheService.set(cacheKey, result, 300);
    console.log(` Cached projects list for user ${userId} (5min TTL)`);
    return result;
  }

  async findOne(userId: number, id: number): Promise<ProjectResponseDto> {
    const cacheKey = this.getProjectCacheKey(id);

    // Use DTO type for caching
    const cachedProject =
      await this.redisCacheService.get<ProjectResponseDto>(cacheKey);
    if (cachedProject !== undefined) {
      console.log(`Serving project ${id} from cache`);

      if (cachedProject.ownerId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      return cachedProject;
    }

    console.log(` Fetching project ${id} from database`);

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

    // Cache the DTO-structured response
    await this.redisCacheService.set(
      cacheKey,
      project as ProjectResponseDto,
      3600,
    );
    console.log(` Cached project ${id} (1hr TTL)`);
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

    await this.redisCacheService.del(this.getProjectCacheKey(id));
    console.log(` Invalidated cache for updated project ${id}`);
    return updatedProject;
  }

  async remove(userId: number, id: number): Promise<Project> {
    await this.validateOwnership(userId, id);

    const deletedProject = await this.prisma.project.delete({
      where: { id },
    });

    await this.redisCacheService.del(this.getProjectCacheKey(id));
    console.log(` Invalidated cache for deleted project ${id}`);
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
