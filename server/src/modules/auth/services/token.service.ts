import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../../../database/entities/user.entity';
import { IAuthTokens } from '../interfaces/auth.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * TokenService
 * Handles JWT token generation and validation
 */
@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Generate access and refresh tokens
     */
    async generateTokens(user: UserDocument): Promise<IAuthTokens> {
        const payload: IJwtPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.accessToken.secret'),
            expiresIn: this.configService.get('jwt.accessToken.expiresIn', '1d'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refreshToken.secret'),
            expiresIn: this.configService.get('jwt.refreshToken.expiresIn', '7d'),
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get('jwt.accessToken.expiresIn', '1d'),
        };
    }
}