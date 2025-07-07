import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  IsNumber, 
  IsEnum, 
  IsDateString, 
  Min, 
  MaxLength 
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'web development',
  MOBILE_APPS = 'mobile apps',
  AI_ML = 'ai/ml',
  DESIGN = 'design',
  OTHERS = 'others'
}

export enum ProjectStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamIds?: string[];

  @IsArray()
  @IsString({ each: true })
  skillsNeeded: string[];

  @IsDateString()
  deadline: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value ?? 0)
  members?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value ?? 0)
  stars?: number = 0;

  @IsEnum(ProjectStatus)
  @IsOptional()
  @Transform(({ value }) => value ?? ProjectStatus.ONGOING)
  status?: ProjectStatus = ProjectStatus.ONGOING;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  requirements?: string;
}