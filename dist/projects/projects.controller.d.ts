import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, createProjectDto: CreateProjectDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
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
            createdAt: Date;
            updatedAt: Date;
            id: number;
            name: string;
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
        owner: {
            email: string;
            id: number;
        };
        tasks: ({
            assignee: {
                email: string;
                id: number;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
            description: string | null;
            completed: boolean;
            projectId: number;
            assigneeId: number | null;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
    update(req: any, id: string, updateProjectDto: UpdateProjectDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
    remove(req: any, id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
}
