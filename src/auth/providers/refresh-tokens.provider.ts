import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { GenerateTokentProvider } from './generate-tokens.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly generateTokenProvider: GenerateTokentProvider,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // Dummy query to simulate fetching the user by numeric 'sub'
      const user = this.getDummyUser(sub); // Using the dummy query method

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Token verification failed',
      );
    }
  }

  // Dummy query method to simulate fetching user by numeric 'sub'
  private getDummyUser(sub: number) {
    // Dummy user data based on numeric 'sub'
    const dummyUsers = [
      { sub: 123, username: 'user1', email: 'user1@example.com' },
      { sub: 456, username: 'user2', email: 'user2@example.com' },
    ];

    // Simulate returning a user by numeric 'sub'
    return dummyUsers.find((user) => user.sub === sub);
  }
}
