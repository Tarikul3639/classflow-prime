import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { IS_PUBLIC_KEY } from '../../shared/decorators/public.decorator';
import { TokenService } from '../../modules/auth/services/token/token.service';
import { setAuthCookies } from '../../shared/utils/auth-cookies.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1️⃣ Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = request.cookies?.['accessToken'];
    const refreshToken = request.cookies?.['refreshToken'];

    // 2️⃣ Exit if no tokens are present in cookies
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Authentication tokens missing');
    }

    // 3️⃣ Attempt to verify the Access Token
    if (accessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(accessToken);
        request['user'] = payload;
        return true;
      } catch (err) {
        // If expired but no refresh token is available, deny access
        if (!refreshToken) {
          throw new UnauthorizedException('Access token expired');
        }
      }
    }

    // 4️⃣ Silent Refresh Logic (Handling undefined strings)
    try {
      // Ensure IP and User-Agent are strings, not undefined
      const ip = (request.ip || request.get('x-forwarded-for') || '127.0.0.1') as string;
      const ua = (request.get('User-Agent') || 'unknown-device') as string;

      // Rotate tokens using the TokenService
      const tokens = await this.tokenService.refreshTokens(refreshToken, ip, ua);

      // Update the client's cookies
      setAuthCookies(response, tokens);

      // Attach the new payload to the request
      const payload = await this.jwtService.verifyAsync(tokens.accessToken);
      request['user'] = payload;

      return true;
    } catch (error: any) {
      // Catch specific security alerts from TokenService (e.g., Compromised session)
      throw new UnauthorizedException(error.message || 'Session expired. Please login again');
    }
  }
}