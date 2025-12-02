import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEventDto } from './dto/create-event.dto';
import { initializeFirebase } from 'src/config/firebase.config';

@Injectable()
export class EventService {
  private readonly db;

  constructor(private configService: ConfigService) {
    this.db = initializeFirebase(this.configService);
  }

  async createEvent(createEventDto: CreateEventDto, tags: string[]): Promise<object> {
    try {

      const startDate = new Date(createEventDto.startDate);
      const endDate = new Date(createEventDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }

      await this.db.collection('events').doc().set({
        ...createEventDto,
        tags,
        status: false
      });


      const createdEvent = {
        message: "Request created successfully"
      }

      return createdEvent;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create event: ${error.message}`);
    }
  }


  async findAll() {
    try {
      const snapshot = await this.db.collection("events").orderBy('endDate', 'asc').get();

      const events: object[] = [];
      
      snapshot.forEach(async (doc: any) => {
        const data = await doc.data();
        events.push({
          id: data.id,
          ...data,
        });
      });

      return events;
    } catch (error: any) {
      throw new BadRequestException(`Failed to fetch events: ${error.message}`);
    }
  }
}
