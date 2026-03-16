import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class DecodeTokenDto {
  @ApiProperty({ description: 'JWT token to decode' })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Type of token to decode',
    enum: ['access', 'refresh'],
    default: 'refresh',
  })
  @IsString()
  @IsIn(['access', 'refresh'], { message: 'type must be either "access" or "refresh"' })
  type: 'access' | 'refresh';
}