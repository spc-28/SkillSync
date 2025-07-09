import { IsString, IsUrl, IsDateString, IsNotEmpty, IsArray } from 'class-validator';

export class ProjectDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({each: true})
  techStack: string[];

  @IsUrl()
  githubUrl: string;

  @IsUrl()
  liveUrl: string;
}

export class ContributionDTO {
  @IsString()
  @IsNotEmpty()
  repo: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  prNumber: string;

  @IsUrl()
  link: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export class HackathonDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  prize: string;

  @IsString()
  @IsNotEmpty()
  teamSize: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsUrl()
  certificateUrl: string;
}

export class CertificationDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  issuer: string;

  @IsDateString()
  date: string;

  @IsUrl()
  certificateUrl: string;

  @IsArray()
  @IsString({each: true})
  skills: string[];
}
