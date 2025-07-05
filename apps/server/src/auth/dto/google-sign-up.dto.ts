import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleSignUpDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  institute: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  uid: string
}