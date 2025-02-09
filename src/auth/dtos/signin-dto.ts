import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  /**
   * The user's email address.
   * It must be a valid email format and cannot be empty.
   */
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  /**
   * The user's password.
   * It must be a string and cannot be empty.
   */
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
