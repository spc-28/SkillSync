import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
