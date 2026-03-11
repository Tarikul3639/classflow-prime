import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from '../entities/user.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async seed() {
    const count = await this.userModel.countDocuments();
    
    if (count > 0) {
      console.log('⏭️  Users already exist, skipping seed...');
      return;
    }

    const users = [
      // ==================== Admin Users ====================
      {
        email: 'admin@classflow.com',
        password: 'Admin@123456',
        firstName: 'System',
        lastName: 'Administrator',
        username: 'admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        bio: 'System administrator with full access',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'superadmin@classflow.com',
        password: 'SuperAdmin@123',
        firstName: 'Super',
        lastName: 'Admin',
        username: 'superadmin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        bio: 'Super administrator account',
        emailVerifiedAt: new Date(),
      },

      // ==================== Teacher Users ====================
      {
        email: 'john.teacher@classflow.com',
        password: 'Teacher@123',
        firstName: 'John',
        lastName: 'Smith',
        username: 'john_smith',
        role: UserRole.TEACHER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        department: 'Computer Science',
        bio: 'Senior Computer Science teacher with 10 years of experience',
        phone: '+8801712345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'sarah.teacher@classflow.com',
        password: 'Teacher@123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        username: 'sarah_johnson',
        role: UserRole.TEACHER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        department: 'Mathematics',
        bio: 'Mathematics teacher specializing in calculus and algebra',
        phone: '+8801812345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'michael.teacher@classflow.com',
        password: 'Teacher@123',
        firstName: 'Michael',
        lastName: 'Brown',
        username: 'michael_brown',
        role: UserRole.TEACHER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        department: 'Physics',
        bio: 'Physics teacher passionate about quantum mechanics',
        phone: '+8801912345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'emily.teacher@classflow.com',
        password: 'Teacher@123',
        firstName: 'Emily',
        lastName: 'Davis',
        username: 'emily_davis',
        role: UserRole.TEACHER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        department: 'English Literature',
        bio: 'English literature teacher with MA in Linguistics',
        phone: '+8801612345678',
        emailVerifiedAt: new Date(),
      },

      // ==================== Student Users ====================
      {
        email: 'alice.student@classflow.com',
        password: 'Student@123',
        firstName: 'Alice',
        lastName: 'Williams',
        username: 'alice_williams',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        studentId: 'CSE-2021-001',
        department: 'Computer Science',
        semester: 6,
        bio: 'Computer Science student interested in AI and Machine Learning',
        phone: '+8801512345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'bob.student@classflow.com',
        password: 'Student@123',
        firstName: 'Bob',
        lastName: 'Miller',
        username: 'bob_miller',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        studentId: 'CSE-2021-002',
        department: 'Computer Science',
        semester: 6,
        bio: 'Aspiring software engineer',
        phone: '+8801412345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'charlie.student@classflow.com',
        password: 'Student@123',
        firstName: 'Charlie',
        lastName: 'Wilson',
        username: 'charlie_wilson',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        studentId: 'MATH-2022-001',
        department: 'Mathematics',
        semester: 4,
        bio: 'Mathematics student passionate about number theory',
        phone: '+8801312345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'diana.student@classflow.com',
        password: 'Student@123',
        firstName: 'Diana',
        lastName: 'Moore',
        username: 'diana_moore',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        studentId: 'PHY-2022-001',
        department: 'Physics',
        semester: 4,
        bio: 'Physics student exploring astrophysics',
        phone: '+8801212345678',
        emailVerifiedAt: new Date(),
      },
      {
        email: 'ethan.student@classflow.com',
        password: 'Student@123',
        firstName: 'Ethan',
        lastName: 'Taylor',
        username: 'ethan_taylor',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isActive: true,
        studentId: 'ENG-2023-001',
        department: 'English Literature',
        semester: 2,
        bio: 'Literature enthusiast and aspiring writer',
        phone: '+8801112345678',
        emailVerifiedAt: new Date(),
      },

      // ==================== Pending Verification Users ====================
      {
        email: 'new.student@classflow.com',
        password: 'NewStudent@123',
        firstName: 'New',
        lastName: 'Student',
        username: 'new_student',
        role: UserRole.STUDENT,
        status: UserStatus.PENDING_VERIFICATION,
        isEmailVerified: false,
        isActive: true,
        studentId: 'CSE-2024-001',
        department: 'Computer Science',
        semester: 1,
        bio: 'Newly registered student',
      },

      // ==================== Inactive User ====================
      {
        email: 'inactive.user@classflow.com',
        password: 'Inactive@123',
        firstName: 'Inactive',
        lastName: 'User',
        username: 'inactive_user',
        role: UserRole.STUDENT,
        status: UserStatus.INACTIVE,
        isEmailVerified: true,
        isActive: false,
        studentId: 'CSE-2020-999',
        department: 'Computer Science',
        semester: 8,
        bio: 'Inactive account for testing',
        emailVerifiedAt: new Date(),
      },

      // ==================== Suspended User ====================
      {
        email: 'suspended.user@classflow.com',
        password: 'Suspended@123',
        firstName: 'Suspended',
        lastName: 'User',
        username: 'suspended_user',
        role: UserRole.STUDENT,
        status: UserStatus.SUSPENDED,
        isEmailVerified: true,
        isActive: false,
        studentId: 'CSE-2020-998',
        department: 'Computer Science',
        semester: 8,
        bio: 'Suspended account for policy violation',
        emailVerifiedAt: new Date(),
      },
    ];

    try {
      const createdUsers = await this.userModel.insertMany(users);
      console.log(`✅ Seeded ${createdUsers.length} users successfully`);
      
      // Log credentials for easy access
      console.log('\n📋 Demo User Credentials:');
      console.log('==========================================');
      console.log('Admin:');
      console.log('  Email: admin@classflow.com');
      console.log('  Password: Admin@123456');
      console.log('\nTeacher:');
      console.log('  Email: john.teacher@classflow.com');
      console.log('  Password: Teacher@123');
      console.log('\nStudent:');
      console.log('  Email: alice.student@classflow.com');
      console.log('  Password: Student@123');
      console.log('==========================================\n');
      
      return createdUsers;
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  }

  async clear() {
    try {
      await this.userModel.deleteMany({});
      console.log('✅ Cleared all users');
    } catch (error) {
      console.error('❌ Error clearing users:', error);
      throw error;
    }
  }
}