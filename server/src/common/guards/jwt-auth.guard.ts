import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenService } from '../../modules/auth/services/token/token.service';
import { setAuthCookies } from '../utils/auth-cookies.util';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  User,
  UserDocument,
} from '../../infrastructure/database/entities/user.entity';

import { UserStatus } from '../../infrastructure/database/interface/user.interface';
import { IJwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = request.cookies?.['accessToken'];
    const refreshToken = request.cookies?.['refreshToken'];

    // 2. Exit if no tokens are present
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Authentication tokens missing');
    }

    // 3. Attempt to verify the Access Token
    if (accessToken) {
      try {
        const payload =
          await this.jwtService.verifyAsync<IJwtPayload>(accessToken);

        // IMPORTANT
        // Check user status from database
        await this.validateUser(payload.userId.toString());

        request['user'] = payload;
        return true;
      } catch (error) {
        // If user is banned/suspended,
        // don't try refresh token
        if (
          error instanceof ForbiddenException ||
          error instanceof UnauthorizedException
        ) {
          throw error;
        }

        // Access token expired
        // Try refresh token
        if (!refreshToken)
          throw new UnauthorizedException('Access token expired');
      }
    }

    // 4. Silent Refresh Logic
    if (refreshToken) {
      try {
        const ip =
          (request.headers['x-forwarded-for'] as string)
            ?.split(',')[0]
            ?.trim() ||
          request.ip ||
          'unknown';
        const ua = request.headers['user-agent'] || 'unknown-device';

        const tokens = await this.tokenService.refreshTokens(
          refreshToken,
          ip,
          ua,
        );

        const payload = await this.jwtService.verifyAsync<IJwtPayload>(
          tokens.accessToken,
        );

        // IMPORTANT
        // Check user again after refresh
        await this.validateUser(payload.userId.toString());

        setAuthCookies(response, tokens);
        // Attach the payload to the request for downstream use
        request['user'] = payload;

        return true;
      } catch (error: any) {
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');
        throw new UnauthorizedException(
          error instanceof ForbiddenException
            ? error.message
            : 'Session expired. Please login again',
        );
      }
    }

    return false;
  }

  // ============================================
  // Validate User
  // ============================================

  private async validateUser(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId).select('_id status');

    // User deleted

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // User banned

    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException('Your account has been banned');
    }

    // User suspended

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended');
    }
  }
}
