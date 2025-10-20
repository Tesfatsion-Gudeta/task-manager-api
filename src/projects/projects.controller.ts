import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.id, createProjectDto);
  }

  @Get()
  findAll(@Request() req, @Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectsService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(req.user.id, +id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.projectsService.remove(req.user.id, +id);
  }
}
