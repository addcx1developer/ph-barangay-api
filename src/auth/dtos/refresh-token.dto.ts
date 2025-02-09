import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  /**
   * The user's refresh token.
   * It must be a valid refreshToken format and cannot be empty.
   */
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}
