import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ITokens } from './token.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signTokens(payload: { sub: string; email: string }): Promise<ITokens> {
    // You can configure expirations in JwtModule options
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}