import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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

    @Get('/task/:id')
    getAllTasks(@Param('id') id: string) {
      return this.projectService.getAllTasks(id);
    }

    @Patch('/task/:id')
    changeTaskStatus(@Param('id') id: string) {
      return this.projectService.updateTaskStatus(id);
    }

    @Patch(':id')
    changeProjectStatus(@Param('id') id: string, @Body() data: { githubLink:string; liveLink:string }) {
      return this.projectService.updateProjectStatus(id, data.githubLink, data.liveLink);
    }

    @Post('/request')
    addRequest(@Body() data: {userId: string, projectId: string, message: string, authorId:string}) {
      return this.projectService.createRequest(data);
    }

    @Get('/request/:id')
    getAllRequests(@Param('id') id: string) {
      return this.projectService.getAllRequests(id);
    }

    @Patch('/request/:id')
    acceptRequest(@Param('id') id: string) {
      return this.projectService.acceptRequest(id);
    }

    @Delete('/request/:id')
    deleteRequest(@Param('id') id: string) {
      return this.projectService.deleteRequest(id);
    }

    @Patch('/addUsers/:id')
    addusersToProject(@Param('id') id: string, @Body() data: {ids: string[]}) {
      return this.projectService.adduserToProject(id, data);
    }
}
