import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(userId: number, createProjectDto: CreateProjectDto): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        ownerId: number;
    }>;
    findAll(userId: number, query: ProjectQueryDto): Promise<{
        data: ({
            tasks: {
                id: number;
                title: string;
                completed: boolean;
            }[];
        } & {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            ownerId: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: number, id: number): Promise<{
        owner: {
            id: number;
            email: string;
        };
        tasks: ({
            assignee: {
                id: number;
                email: string;
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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        ownerId: number;
    }>;
    update(userId: number, id: number, updateProjectDto: UpdateProjectDto): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        ownerId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        ownerId: number;
    }>;
}
