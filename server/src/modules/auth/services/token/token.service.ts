import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { StringValue } from 'ms';
import ms from 'ms';

import type { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import type { ITokens } from './token.types';
import { User, UserDocument } from 'src/database/entities/user.entity';
import { UserRole } from 'src/database/interface/user.interface';
import { Session, SessionDocument } from 'src/database/entities/session.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
  ) { }

  private get jwtAccessTokenExpiresIn(): StringValue {
    return this.configService.get<StringValue>('jwt.accessToken.expiresIn', '15m');
  }

  private get jwtRefreshTokenExpiresIn(): StringValue {
    return this.configService.get<StringValue>('jwt.refreshToken.expiresIn', '7d');
  }

  /**
 * Generates Access and Refresh JWTs
 */
  async signTokens(payload: IJwtPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: this.jwtAccessTokenExpiresIn }),
      this.jwtService.signAsync(payload, { expiresIn: this.jwtRefreshTokenExpiresIn }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Initial login: Generates tokens and creates a new persistent session
   */
  async createSession(userId: string, email: string, role: UserRole, ip: string, ua: string): Promise<ITokens> {
    const payload: IJwtPayload = { sub: userId, email, role, ip, ua };
    const tokens = await this.signTokens(payload);

    // Create a new session entry linked to this specific device/browser
    const session = new this.sessionModel({
      userId: new Types.ObjectId(userId),
      ipAddress: ip,
      userAgent: ua,
      expiresAt: new Date(Date.now() + ms(this.jwtRefreshTokenExpiresIn)),
    });

    // Hash the refresh token before saving to database (Security)
    await session.setToken(tokens.refreshToken);
    await session.save();

    return tokens;
  }

  /**
   * Refreshes session: Implements Token Rotation and Reuse Detection
   */
  async refreshTokens(refreshToken: string, ip: string, ua: string): Promise<ITokens> {
    let payload: IJwtPayload;

    // 1️) Verify JWT Integrity
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Session expired or invalid');
    }

    // 2️) Detect Session Leak / Reuse
    // We find all active sessions for this user to compare hashes
    const sessions = await this.sessionModel.find({ userId: payload.sub });

    let currentSession: SessionDocument | null = null;
    for (const s of sessions) {
      if (await s.compareToken(refreshToken)) {
        currentSession = s;
        break;
      }
    }

    // If token is valid but not found in DB, it was likely already used (Theft attempt)
    if (!currentSession) {
      await this.sessionModel.deleteMany({ userId: payload.sub });
      throw new ForbiddenException('Security Alert: Compromised session detected. All devices logged out.');
    }

    // 3️) Verify Device Fingerprint (IP & User-Agent)
    if (currentSession.userAgent !== ua) {
      // Optional: Log this for security auditing
      throw new UnauthorizedException('Device mismatch. Please login again.');
    }

    // 4️) Check Expiration
    if (currentSession.isExpired()) {
      await currentSession.deleteOne();
      throw new UnauthorizedException('Session has expired');
    }

    // 5️) Prepare New Tokens (Rotation)
    const user = await this.userModel.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User no longer exists');

    const tokens = await this.signTokens({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      ip: ip,
      ua: ua,
    });

    // 6️) Update Existing Session instead of creating a new one
    await currentSession.setToken(tokens.refreshToken);
    currentSession.ipAddress = ip; // Update IP in case of network switch
    currentSession.expiresAt = new Date(Date.now() + ms(this.jwtRefreshTokenExpiresIn));
    await currentSession.save();

    return tokens;
  }

  /**
   * Logs out a specific session
   */
  async revokeSession(refreshToken: string): Promise<void> {
    const payload = this.jwtService.decode(refreshToken) as IJwtPayload;
    const sessions = await this.sessionModel.find({ userId: payload.sub });

    for (const s of sessions) {
      if (await s.compareToken(refreshToken)) {
        await s.deleteOne();
        break;
      }
    }
  }
}