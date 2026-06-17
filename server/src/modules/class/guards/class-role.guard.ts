import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CLASS_ROLE_KEY } from '../decorators/class-role.decorator';
import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';
import { Enrollment, EnrollmentDocument } from '../../../infrastructure/database/entities/enrollment.entity';
import { Class, ClassDocument } from '../../../infrastructure/database/entities/class.entity';

@Injectable()
export class ClassRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EnrollmentRole[]>(CLASS_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const { actor, params } = request;
    const classId = params?.classId;

    if (!classId || !Types.ObjectId.isValid(classId)) {
      throw new ForbiddenException('Valid Class ID is required');
    }

    if (!actor || actor.type !== 'user') {
      throw new ForbiddenException('Only class members can access this route');
    }

    const classObjectId = new Types.ObjectId(classId);
    const userObjectId = new Types.ObjectId(actor.userId);

    // 1. Instructor Check
    const isInstructor = await this.classModel.exists({
      _id: classObjectId,
      instructorId: userObjectId,
    });

    if (isInstructor) {
      if (requiredRoles.includes('instructor' as EnrollmentRole)) {
        request.classRole = 'instructor';
        return true;
      }
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    // 2. Enrollment Check
    const enrollment = await this.enrollmentModel.findOne({
      classId: classObjectId,
      userId: userObjectId,
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this class');
    }

    if (!requiredRoles.includes(enrollment.role)) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    request.enrollment = enrollment;
    request.classRole = enrollment.role;

    return true;
  }
}