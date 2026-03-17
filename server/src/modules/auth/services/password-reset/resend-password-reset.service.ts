// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { RequestPasswordResetDto } from '../../dto/password-reset/request-password-reset.dto';
// import { User, UserDocument } from '../../../../database/entities/user.entity';
// import { MailService } from '../../../../modules/mail/services/mail.service';

// @Injectable()
// export class ResendPasswordResetService {
//   private readonly otpExpiryMinutes = 15;
//   private readonly cooldownSeconds = 60;

//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     private readonly mailService: MailService,
//   ) {}

//   async execute(dto: RequestPasswordResetDto) {
//     const email = dto.email.toLowerCase().trim();

//     // 1️⃣ Find user and ensure we have the necessary fields for OTP logic
//     const user = await this.userModel.findOne({ email });
    
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // 2️⃣ Check cooldown to prevent SMTP spam
//     // Note: You must ensure 'assertPasswordResetCooldown' is defined in UserSchema
//     try {
//       user.assertPasswordResetCooldown(this.cooldownSeconds);
//     } catch (error: any) {
//       throw new BadRequestException(error.message || 'Please wait before requesting another code');
//     }

//     // 3️⃣ Generate new code and update expiry
//     // Note: You must ensure 'createPasswordResetCode' is defined in UserSchema
//     const code = user.createPasswordResetCode(this.otpExpiryMinutes);
    
//     // 4️⃣ Update request timestamp and persist changes
//     user.lastPasswordResetRequestAt = new Date();
//     await user.save();

//     // 5️⃣ Send the email
//     // Aligned with your User Entity property 'name'
//     await this.mailService.sendPasswordResetEmail(
//       user.email,
//       user.name, 
//       code,
//     );

//     return { message: 'Password reset code resent successfully' };
//   }
// }