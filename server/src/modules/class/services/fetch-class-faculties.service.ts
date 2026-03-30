import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Class, ClassDocument } from '../../../database/entities/class.entity';
import {
    Enrollment,
    EnrollmentDocument,
} from 'src/database/entities/enrollment.entity';
import {
    Faculty,
    FacultyDocument,
} from '../../../database/entities/faculty.entity';
import { FetchClassFacultiesResponseDto } from '../dto/class-faculty.dto';

@Injectable()
export class FetchClassFacultiesService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
        @InjectModel(Faculty.name)
        private readonly facultyModel: Model<FacultyDocument>,
    ) { }

    async execute(
        userId: string,
        classId: string,
    ): Promise<FetchClassFacultiesResponseDto> {
        const existingClass = await this.classModel.findById(classId);
        if (!existingClass) throw new NotFoundException('Class not found');

        const enrollment = await this.enrollmentModel.findOne({
            classId: new Types.ObjectId(classId),
            userId: new Types.ObjectId(userId),
        });
        if (
            !enrollment &&
            existingClass.instructorId.toString() !== userId &&
            !existingClass.assistantIds?.some((id) => id.toString() === userId)
        ) {
            throw new ForbiddenException('You are not enrolled in this class');
        }

        const faculties = await this.facultyModel
            .find({ classId: new Types.ObjectId(classId) })
            .lean()
            .exec();

        return {
            success: true,
            message: 'Faculties fetched successfully',
            data: {
                classId,
                faculties: faculties.map((f) => ({
                    facultyId: f._id.toString(),
                    name: f.name,
                    designation: f.designation,
                    location: f.location,
                    email: f.email,
                    avatarUrl: f.avatarUrl,
                    phone: f.phone,
                    classroomCode: f.classroomCode,
                })),
            },
        };
    }
}
