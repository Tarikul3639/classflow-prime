import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { DecodeTokenDto } from '../dto/debug/debug.dto';
import { Public } from '../../../shared/decorators/public.decorator';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Post('decode-token')
  @ApiOperation({ summary: 'Decode a JWT token' })
  decodeToken(@Body() dto: DecodeTokenDto) {
    const { token, type } = dto;

    try {
      const payload = this.jwtService.decode(token, { json: true }) as IJwtPayload;

      // exp timestamp convert to local time
      const expLocal = payload?.exp
        ? new Date(payload.exp * 1000).toLocaleString()
        : null;

      return {
        success: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} token decoded successfully`,
        payload: { ...payload, exp: expLocal },
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
