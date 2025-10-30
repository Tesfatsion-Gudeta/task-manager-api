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
exports.ProjectsListResponseDto = exports.ProjectResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectAssigneeResponseDto {
    id;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectAssigneeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectAssigneeResponseDto.prototype, "email", void 0);
class ProjectTaskResponseDto {
    id;
    title;
    completed;
    assignee;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectTaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectTaskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProjectTaskResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", ProjectAssigneeResponseDto)
], ProjectTaskResponseDto.prototype, "assignee", void 0);
class ProjectOwnerResponseDto {
    id;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectOwnerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectOwnerResponseDto.prototype, "email", void 0);
class ProjectResponseDto {
    id;
    name;
    ownerId;
    createdAt;
    updatedAt;
    tasks;
    owner;
}
exports.ProjectResponseDto = ProjectResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProjectResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProjectResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ProjectTaskResponseDto], required: false }),
    __metadata("design:type", Array)
], ProjectResponseDto.prototype, "tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => ProjectOwnerResponseDto, required: false }),
    __metadata("design:type", ProjectOwnerResponseDto)
], ProjectResponseDto.prototype, "owner", void 0);
class ProjectsListResponseDto {
    data;
    meta;
}
exports.ProjectsListResponseDto = ProjectsListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProjectResponseDto] }),
    __metadata("design:type", Array)
], ProjectsListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ProjectsListResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=project-response.dto.js.map