import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import type { UserDocument } from '../../../database/entities/user.entity';

/**
 * LocalStrategy
 * Validates user credentials (email + password)
 * Used for login endpoint
 * 
 * Usage:
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * async login(@CurrentUser() user: UserDocument) {
 *   return this.authService.generateTokens(user);
 * }
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      // Use 'email' instead of default 'username'
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validate user credentials
   * @param email - User email
   * @param password - User password
   * @returns User document if valid
   * @throws UnauthorizedException if invalid
   */
  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
}