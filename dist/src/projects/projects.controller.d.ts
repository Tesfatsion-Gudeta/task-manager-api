import { ProjectsService } from './projects.service';
import { UpdateProjectDto, ProjectQueryDto, ProjectsListResponseDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(userId: number, query: ProjectQueryDto): Promise<ProjectsListResponseDto>;
    findOne(userId: number, id: number): Promise<import("./dto").ProjectResponseDto>;
    update(userId: number, id: number, updateProjectDto: UpdateProjectDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
}
