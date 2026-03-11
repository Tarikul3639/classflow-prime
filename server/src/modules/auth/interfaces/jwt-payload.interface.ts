import { UserRole } from 'src/database/entities/user.entity';
import { Types } from 'mongoose';

// ==================== JWT Payload Interface ====================
export interface IJwtPayload {
  sub: string | Types.ObjectId;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}