import { Body, Post, Controller } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JoinClassRequestDto } from "../dto/join-class.dto";
import { JoinClassService } from "../services/join-class.service";

import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags("Class")
@Controller("classes")
export class JoinClassController {
    constructor(private readonly joinClassService: JoinClassService) { }

    @Post("join")
    @ApiOperation({ summary: "Join a class using a join code" })
    @ApiResponse({ status: 200, description: "Successfully joined the class" })
    async joinClass(
        @CurrentUser() user: IJwtPayload,
        @Body() joinClassRequestDto: JoinClassRequestDto,
    ) {
        return await this.joinClassService.execute(
            user.userId.toString(),
            joinClassRequestDto,
        );
    }
}