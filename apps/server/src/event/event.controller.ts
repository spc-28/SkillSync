import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { GeminiService } from 'src/gemini/gemini.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService,  private readonly geminiService: GeminiService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const { tags } = await this.geminiService.getTags(`${createEventDto.eventName} ${createEventDto.eventDescription} ${createEventDto.eventType}`); 
    return this.eventService.createEvent(createEventDto, tags);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

}
