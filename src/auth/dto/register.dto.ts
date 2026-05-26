import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  declare full_name: string;

  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(6)
  declare password: string;

  @IsString()
  @Matches(/^(user|admin)$/)
  declare role: 'user' | 'admin';
}
