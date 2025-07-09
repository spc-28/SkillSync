import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/profile.dto';
import { ProjectDTO } from './dto/profile-meta-dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('/:id')
  updateProfile(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.profileService.updateUserDetails(id, payload)
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.profileService.getUserById(id);
  }

  @Post('/:id/project')
  addProject(@Param('id') id: string, @Body() data: ProjectDTO) {
    return this.profileService.addProject(id, data);
  }

  @Post('/:id/contribution')
  addContribution(@Param('id') id: string, @Body() data: any) {
    return this.profileService.addContribution(id, data);
  }

  @Post('/:id/hackathon')
  addHackathon(@Param('id') id: string, @Body() data: any) {
    return this.profileService.addHackathon(id, data);
  }

  @Post('/:id/certification')
  addCertification(@Param('id') id: string, @Body() data: any) {
    return this.profileService.addCertification(id, data);
  }

  @Get('/meta/:id') 
  getAllMeta(@Param('id') id: string) {
    return this.profileService.getAllMeta(id);
  }
}
