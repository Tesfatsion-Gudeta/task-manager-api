import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The registered email address of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    description: 'The account password (minimum 6 characters).',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'The email address for the new account.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass2025!',
    minLength: 6,
    description: 'The password for the new user (minimum 6 characters).',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
