// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { RequestPasswordResetDto } from '../../dto/password-reset/request-password-reset.dto';
// import { User, UserDocument } from '../../../../database/entities/user.entity';
// import { Throttle, ThrottleDocument } from '../../../../database/entities/throttle.entity';
// import { ThrottlePurpose } from '../../../../database/interface/throttle.interface';
// import { MailService } from '../../../../modules/mail/services/mail.service';

// @Injectable()
// export class RequestPasswordResetService {
//   private readonly otpExpiryMinutes = 15;
//   private readonly cooldownMinutes = 1; // 60 seconds cooldown

//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     @InjectModel(Throttle.name) private readonly throttleModel: Model<ThrottleDocument>,
//     private readonly mailService: MailService,
//   ) {}

//   async execute(dto: RequestPasswordResetDto, ip: string) {
//     const email = dto.email.toLowerCase().trim();

//     // 1️⃣ Verify User exists
//     const user = await this.userModel.findOne({ email });
//     if (!user) {
//       // In production, you might return success anyway to prevent email enumeration
//       throw new NotFoundException('User not found');
//     }

//     // 2️⃣ Check Cooldown & Existing OTP via Throttle Model
//     // We use Throttle as the source of truth for the OTP code
//     let throttle = await this.throttleModel.findOne({
//       identifier: email,
//       purpose: ThrottlePurpose.PASSWORD_RESET,
//     });

//     if (throttle && throttle.isBlocked()) {
//       const remainingSec = Math.ceil((throttle.expiresAt!.getTime() - Date.now()) / 1000);
//       throw new BadRequestException(`Please wait ${remainingSec}s before requesting a new code.`);
//     }

//     // 3️⃣ Generate 6-digit OTP
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // 4️⃣ Update or Create Throttle record
//     if (!throttle) {
//       throttle = new this.throttleModel({
//         purpose: ThrottlePurpose.PASSWORD_RESET,
//         ipAddress: ip,
//         identifier: email,
//       });
//     }

//     // Use the Throttle record to store the OTP logic
//     // We hijack 'attempts' or use a custom field if you add 'token' to Throttle
//     // For now, let's assume we store the OTP in a dedicated field or use this record as a lock
//     throttle.userAgent = otpCode; // Temporary storage or add 'token' field to Throttle schema
//     throttle.expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60000);
//     await throttle.save();

//     // 5️⃣ Send Email
//     await this.mailService.sendPasswordResetEmail(
//       user.email,
//       user.name,
//       otpCode,
//     );

//     return { message: 'Password reset code sent to your email' };
//   }
// }