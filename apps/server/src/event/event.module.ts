import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
