import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(userId: number, createProjectDto: CreateProjectDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
    findAll(userId: number, query: ProjectQueryDto): Promise<{
        data: ({
            tasks: {
                completed: boolean;
                title: string;
                id: number;
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
    findOne(userId: number, id: number): Promise<{
        tasks: ({
            assignee: {
                email: string;
                id: number;
            } | null;
        } & {
            completed: boolean;
            projectId: number;
            assigneeId: number | null;
            description: string | null;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        })[];
        owner: {
            email: string;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: string;
        ownerId: number;
    }>;
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
