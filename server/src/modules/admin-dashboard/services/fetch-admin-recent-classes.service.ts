import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import { AdminDashboardClassDto } from '../dto/admin-dashboard-class.dto';

@Injectable()
export class FetchAdminRecentClassesService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async fetchRecentClasses(limit: number): Promise<AdminDashboardClassDto[]> {
        const recentClasses = await this.classModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select(
                '_id className department semester themeColor coverImage status allowEnroll createdAt',
            )
            .lean();

        return recentClasses.map((cls) => ({
            id: cls._id.toString(),
            className: cls.className,
            department: cls.department || undefined,
            semester: cls.semester || undefined,
            themeColor: cls.themeColor,
            coverImage: cls.coverImage || null,
            status: cls.status,
            allowEnroll: cls.allowEnroll,
            createdAt: cls.createdAt ?? new Date(),
        }));
    }
}
