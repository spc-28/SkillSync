import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

   @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
      return this.projectService.createProject(createProjectDto);
    }
  
    @Get()
    findAll() {
      return this.projectService.findAll();
    }

    @Get(':id')
    findWorkspaceProjects(@Param('id') id: string) {
      return this.projectService.workspaceProjects(id);
    }
}
