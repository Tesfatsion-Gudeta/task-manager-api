import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, createProjectDto: CreateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    findAll(req: any, query: ProjectQueryDto): Promise<{
        data: ({
            tasks: {
                id: number;
                title: string;
                completed: boolean;
            }[];
        } & {
            id: number;
            name: string;
            createdAt: Date;
            ownerId: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(req: any, id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    update(req: any, id: string, updateProjectDto: UpdateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
    remove(req: any, id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        ownerId: number;
    }>;
}
