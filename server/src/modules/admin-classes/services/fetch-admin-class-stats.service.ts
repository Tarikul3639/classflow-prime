import { Injectable } from '@nestjs/common';
import { AdminClassStatsDto } from '../dto/admin-class-stats.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';

@Injectable()
export class FetchAdminClassStatsService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async fetchAdminClassStats(): Promise<ApiResponseDto<AdminClassStatsDto>> {
        // Simulate fetching data from a database or other source
        const totalClasses = await this.classModel.countDocuments().exec();
        const activeClasses = await this.classModel
            .countDocuments({ status: ClassStatus.ACTIVE })
            .exec();
        const endedClasses = await this.classModel
            .countDocuments({ status: ClassStatus.ENDED })
            .exec();
        const upcomingClasses = await this.classModel
            .countDocuments({ status: ClassStatus.UPCOMING })
            .exec();
        const blockedClasses = await this.classModel
            .countDocuments({ isBlocked: true })
            .exec();

        return {
            success: true,
            message: 'Admin class statistics fetched successfully',
            status: 200,
            data: {
                totalClasses,
                activeClasses,
                endedClasses,
                upcomingClasses,
                blockedClasses,
            },
        };
    }
}
