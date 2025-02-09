import { AccessTokenGuard } from './../access-token/access-token.guard';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { AuthType } from 'src/auth/enums/auth-type.enum';

/**
 * A guard that handles authentication based on the configured auth types.
 *
 * @remarks
 * This guard takes into account the auth types specified in the route handlers
 * and controllers. It uses the {@link AccessTokenGuard} to handle the `Bearer` auth type.
 * If no auth type is specified, or if the auth type is `None`, this guard will
 * simply allow the request to pass through.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * A mapping of auth types to their corresponding guards.
   */
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  /**
   * Checks if the request is authenticated based on the configured auth types.
   *
   * @remarks
   * This method iterates over the configured auth types and their corresponding
   * guards. If any of the guards allows the request to pass through, this method
   * returns `true`.
   *
   * @param context - The execution context.
   * @returns A promise that resolves to a boolean indicating if the request is authenticated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the auth types configured for the current route handler
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) || [AuthenticationGuard.defaultAuthType];

    // Map each auth type to its corresponding guard
    const guards = authTypes.flatMap((type) => this.authTypeGuardMap[type]);

    // Iterate over the guards and check if any of them allow the request to pass through
    for (const guard of guards) {
      try {
        if (await guard.canActivate(context)) {
          // If any guard allows the request to pass through, we can exit the loop
          return true;
        }
      } catch (error) {
        // If a guard fails, throw an UnauthorizedException
        throw new UnauthorizedException(
          `Guard ${guard.constructor.name} failed`,
          error,
        );
      }
    }
    // If none of the guards allow the request to pass through, throw an UnauthorizedException
    throw new UnauthorizedException('Unauthorized');
  }
}
