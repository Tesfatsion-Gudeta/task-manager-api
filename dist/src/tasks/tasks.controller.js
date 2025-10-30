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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorators_1 = require("../common/decorators/get-user.decorators");
const roles_decorators_1 = require("../common/decorators/roles.decorators");
const client_1 = require("@prisma/client");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(userId, createTaskDto) {
        return this.tasksService.createTask(userId, createTaskDto);
    }
    findAll(userId, query) {
        return this.tasksService.findAll(userId, query);
    }
    findOne(userId, id) {
        return this.tasksService.findOne(userId, id);
    }
    update(userId, id, dto) {
        return this.tasksService.update(userId, id, dto);
    }
    remove(userId, id) {
        return this.tasksService.remove(userId, id);
    }
    toggleComplete(userId, id) {
        return this.tasksService.toggleComplete(userId, id);
    }
    assignTask(userId, id, assigneeId) {
        return this.tasksService.assignTask(userId, id, assigneeId);
    }
    unassignTask(userId, id) {
        return this.tasksService.unassignTask(userId, id);
    }
    findAllAdmin(query) {
        return this.tasksService.findAll(0, query, true);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task in a project' }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateTaskDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Task created successfully',
        type: dto_1.TaskResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'User cannot create tasks in projects they do not own',
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all tasks for the authenticated user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['title', 'completed', 'createdAt'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiQuery)({ name: 'completed', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'assigneeId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a paginated list of tasks',
        type: dto_1.TasksListResponseDto,
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.TaskQueryDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single task by its ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the requested task',
        type: dto_1.TaskResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateTaskDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task updated successfully',
        type: dto_1.TaskResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot modify tasks outside user projects',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot delete tasks outside user projects',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/toggle-complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle the completion status of a task' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task completion status toggled',
        type: dto_1.TaskResponseDto,
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "toggleComplete", null);
__decorate([
    (0, common_1.Post)(':id/assign/:assigneeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a task to a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task assigned successfully',
        type: dto_1.TaskResponseDto,
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('assigneeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Post)(':id/unassign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unassign a task' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task unassigned successfully',
        type: dto_1.TaskResponseDto,
    }),
    __param(0, (0, get_user_decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "unassignTask", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, roles_decorators_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Retrieve all tasks across all projects' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a paginated list of all tasks for admins',
        type: dto_1.TasksListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskQueryDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAllAdmin", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map