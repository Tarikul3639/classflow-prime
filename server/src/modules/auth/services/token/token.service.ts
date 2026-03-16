import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from "ms";
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import type { ITokens } from './token.types';
import { User, UserDocument } from '../../../../database/entities/user.entity';


/**
 * Service for handling JWT token generation and refreshing
 * This service is used by the SignInService to generate tokens upon successful login
 * and by the RefreshController to refresh tokens using a valid refresh token.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  private get jwtAccessTokenExpiresIn(): StringValue {
    return this.configService.get<StringValue>('jwt.accessToken.expiresIn', '15m');
  }
  private get jwtRefreshExpiresIn(): StringValue {
    return this.configService.get<StringValue>('jwt.refreshToken.expiresIn', '7d');
  }

  /**
   * Generate access and refresh tokens for a given user payload
   * @param payload - The payload to include in the JWT (e.g., user ID and email)
   * @returns An object containing the access token and refresh token
   */

  async signTokens(payload: IJwtPayload): Promise<ITokens> {
    // You can configure expirations in JwtModule options
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: this.jwtAccessTokenExpiresIn });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: this.jwtRefreshExpiresIn });
    return { accessToken, refreshToken };
  }

  /**
   * Refresh access and refresh tokens using a valid refresh token
   * @param refreshToken - The refresh token to validate and use for generating new tokens
   * @returns An object containing the new access token and refresh token
   */
  async refreshTokens(refreshToken: string): Promise<ITokens> {
    let payload: IJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // 1. Get user
    const user: UserDocument | null = await this.userModel.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    // 2. Check if refresh token is still valid (exists in DB)
    if (!user.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // 3. Rotate: Remove old, add new token (single use strategy)
    // Remove used/old refresh token
    user.refreshTokens = user.refreshTokens.filter((tok: string) => tok !== refreshToken);

    // 4. Issue new tokens
    const tokens = await this.signTokens({ sub: user._id, email: user.email, role: user.role });

    // Save new refreshToken (rotation, or you can limit for security)
    user.refreshTokens.push(tokens.refreshToken);

    await user.save();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}