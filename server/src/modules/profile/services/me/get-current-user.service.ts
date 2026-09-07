import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  User,
  UserDocument,
} from '../../../../infrastructure/database/entities/user.entity';

import {
  Enrollment,
  EnrollmentDocument,
} from '../../../../infrastructure/database/entities/enrollment.entity';

import { UserRole } from '../../../../infrastructure/database/interface/user.interface';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  bio?: string;
  avatarUrl?: string;
  enrolledClasses: {
    classId: string;
    className: string;
    themeColor?: string;
    coverImage?: string;
    role: string;
    status: string;
    enrolledAt: Date;
  }[];
}

export interface IGetCurrentUserResponseDto {
  success: boolean;
  message: string;
  data: {
    user: IUser;
  };
}

@Injectable()
export class GetCurrentUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) { }

  async execute(userId: string): Promise<IGetCurrentUserResponseDto> {
    // 1. Find user
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    // 2. Find user's enrollments with class information
    const enrollments = await this.enrollmentModel
      .find({
        userId: user._id,
      })
      .populate({
        path: 'classId',
        select: 'className status themeColor coverImage',
      })
      .lean();

    // 3. Format enrolled classes
    const enrolledClasses = enrollments
      .filter((enrollment) => enrollment.classId)
      .map((enrollment: any) => ({
        classId: enrollment.classId._id.toString(),
        className: enrollment.classId.className,
        status: enrollment.classId.status,
        themeColor: enrollment.classId.themeColor,
        coverImage: enrollment.classId.coverImage,
        role: enrollment.role,
        enrolledAt: enrollment.enrolledAt,
      }));

    // 4. Return response
    return {
      success: true,
      message: 'User profile fetched successfully',
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          bio: user.bio,
          avatarUrl: user.avatarUrl || undefined,
          enrolledClasses,
        },
      },
    };
  }
}