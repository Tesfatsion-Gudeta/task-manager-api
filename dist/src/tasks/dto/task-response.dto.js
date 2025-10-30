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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksListResponseDto = exports.TaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskOwnerResponseDto {
    id;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaskOwnerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskOwnerResponseDto.prototype, "email", void 0);
class TaskProjectResponseDto {
    id;
    name;
    owner;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaskProjectResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskProjectResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => TaskOwnerResponseDto }),
    __metadata("design:type", TaskOwnerResponseDto)
], TaskProjectResponseDto.prototype, "owner", void 0);
class TaskAssigneeResponseDto {
    id;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaskAssigneeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskAssigneeResponseDto.prototype, "email", void 0);
class TaskResponseDto {
    id;
    title;
    description;
    completed;
    projectId;
    assigneeId;
    createdAt;
    updatedAt;
    project;
    assignee;
}
exports.TaskResponseDto = TaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TaskResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "assigneeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TaskResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TaskResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => TaskProjectResponseDto }),
    __metadata("design:type", TaskProjectResponseDto)
], TaskResponseDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => TaskAssigneeResponseDto, required: false }),
    __metadata("design:type", TaskAssigneeResponseDto)
], TaskResponseDto.prototype, "assignee", void 0);
class TasksListResponseDto {
    data;
    meta;
}
exports.TasksListResponseDto = TasksListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskResponseDto] }),
    __metadata("design:type", Array)
], TasksListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], TasksListResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=task-response.dto.js.map