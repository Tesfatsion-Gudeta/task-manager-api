"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const projects_service_1 = require("./projects.service");
const dto_1 = require("./dto");
const get_user_decorators_1 = require("../common/decorators/get-user.decorators");
const swagger_1 = require("@nestjs/swagger");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async create(userId, createProjectDto) {
        return this.projectsService.createProject(userId, createProjectDto);
    }
    async findAll(userId, query) {
        return this.projectsService.findAll(userId, query);
    }
    async findOne(userId, id) {
        return this.projectsService.findOne(userId, id);
    }
    async update(userId, id, updateProjectDto) {
        return this.projectsService.update(userId, id, updateProjectDto);
    }
    async remove(userId, id) {
        return this.projectsService.remove(userId, id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project' }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateProjectDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Project created successfully',
        schema: {
            example: {
                id: 1,
                name: 'Website Redesign',
                ownerId: 1,
                createdAt: '2025-10-25T13:00:00.000Z',
                updatedAt: '2025-10-25T13:00:00.000Z',
            },
        },
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all projects for the logged-in user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, example: 'Website' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, example: 'desc' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of projects with pagination metadata',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        name: 'Website Redesign',
                        ownerId: 1,
                        tasks: [{ id: 1, title: 'Landing page', completed: false }],
                        createdAt: '2025-10-25T13:00:00.000Z',
                        updatedAt: '2025-10-25T13:00:00.000Z',
                    },
                ],
                meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
            },
        },
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.ProjectQueryDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single project by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, example: 1 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Project found',
        schema: {
            example: {
                id: 1,
                name: 'Website Redesign',
                ownerId: 1,
                tasks: [{ id: 1, title: 'Landing page', completed: false }],
                createdAt: '2025-10-25T13:00:00.000Z',
                updatedAt: '2025-10-25T13:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a project' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, example: 1 }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateProjectDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a project' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects'),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map