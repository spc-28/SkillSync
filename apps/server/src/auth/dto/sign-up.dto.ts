import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  institute: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}