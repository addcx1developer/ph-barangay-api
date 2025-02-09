import { SignInDto } from './../dtos/signin-dto';
import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { GenerateTokentProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokenProvider: GenerateTokentProvider,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      // Await the result of the dummy query
      const user = await this.getDummyUserByEmail(signInDto.email); // Corrected by awaiting the async method

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verifying password (comparison)
      const passwordMatches = await this.verifyPassword(
        signInDto.password,
        user.password,
      );
      if (!passwordMatches) {
        throw new UnauthorizedException('Password does not match');
      }

      // Generate and return tokens
      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Sign-in failed',
      });
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await this.hashingProvider.comparePassword(password, hash);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Password comparison failed',
      });
    }
  }

  // Dummy query to simulate finding a user by email
  private async getDummyUserByEmail(email: string) {
    // Dummy users array
    const dummyUsers = [
      {
        email: 'user1@example.com',
        password: await this.hashingProvider.hashPassword('password1'),
        username: 'user1',
      },
      {
        email: 'user2@example.com',
        password: await this.hashingProvider.hashPassword('password@'),
        username: 'user2',
      },
    ];

    // Return a user with matching email (simulating user lookup)
    return dummyUsers.find((user) => user.email === email);
  }
}
