import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import type { IJwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JwtRefreshStrategy
 * Validates JWT refresh tokens
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // ✅ Now guaranteed to be string
      passReqToCallback: true,
    });
  }

  /**
   * Validate refresh token payload
   * @param req - Express request object
   * @param payload - Decoded JWT payload
   */
  async validate(req: Request, payload: IJwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}