import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for sign out request
 * Refresh token is optional - if not provided, all tokens will be revoked
 */
export class SignOutDto {
  /**
   * Refresh token to revoke (optional)
   * If not provided, all refresh tokens will be revoked (logout from all devices)
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */

  @ApiPropertyOptional({
    description:
      'Refresh token to revoke. If not provided, logs out from all devices.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string;
}
