import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get(':id')
  workspaceInfo(@Param('id') id: string) {
    return this.workspaceService.workspaceInfo(id);
  }

  @Post('/task')
  createTask(@Body() data: { projectId: string; userId: string; task: string; timestamp: string;}) {
    return this.workspaceService.createTask(data);
  }

}
