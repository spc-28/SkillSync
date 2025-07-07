import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export enum EventType {
  HACKATHON = 'hackathon',
  WORKSHOP = 'workshop',
  CONFERENCE = 'conference',
  COMPETITION = 'competition',
  MEETUP = 'meetup',
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @IsNotEmpty()
  @IsString()
  organizer: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  eventDescription: string;

  @IsNotEmpty()
  @IsUrl()
  officialWebsite: string;

  @IsOptional()
  @IsString()
  prizesBenefits?: string;
}