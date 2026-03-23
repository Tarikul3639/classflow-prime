import { Get, Param, Controller } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import type { IJwtPayload } from "../../../modules/auth/interfaces/jwt-payload.interface";

import { FetchClassOverviewResponseDto } from "../dto/fetch-class-overview.dto";
import { FetchClassOverviewService } from "../services/fetch-class-overview.service";

@ApiTags("Class")
@Controller("classes")
export class FetchClassOverviewController {
    constructor(private readonly fetchClassOverviewService: FetchClassOverviewService) { }

    @Get(":classId/overview")
    @ApiOperation({ summary: "Fetch class overview by ID" })
    @ApiResponse({ status: 200, description: "Class overview fetched successfully" })
    async fetchClassOverview(
        @CurrentUser() user: IJwtPayload,
        @Param("classId") classId: string,
    ): Promise<FetchClassOverviewResponseDto> {
        console.log("Class ID: ", classId, "User ID: ", user.userId); // DEBUG: Log the classId and userId received from the request
        return await this.fetchClassOverviewService.execute(
            user.userId.toString(),
            classId,
        );
    }
}