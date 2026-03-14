import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import {
  AuthThrottle,
  AuthThrottleDocument,
  ThrottlePurpose,
} from '../../../../database/entities/auth-throttle.entity';

@Injectable()
export class AuthThrottleService {
  constructor(
    @InjectModel(AuthThrottle.name)
    private readonly throttleModel: Model<AuthThrottleDocument>,
  ) {}

  async getOrCreate(params: {
    key: string;
    ip: string;
    purpose: ThrottlePurpose;
    userAgent?: string;
  }) {
    const { key, ip, purpose, userAgent } = params;

    return this.throttleModel.findOneAndUpdate(
      { key, ip, purpose },
      {
        $setOnInsert: { key, ip, purpose },
        $set: { lastUserAgent: userAgent ?? '' },
      },
      {
        upsert: true,
        returnDocument: 'after', // ✅ replaces new:true
      },
    );
  }

  async assertNotLocked(params: {
    key: string;
    ip: string;
    purpose: ThrottlePurpose;
    userAgent?: string;
  }) {
    const doc = await this.getOrCreate(params);

    // doc can be null in some edge cases; be safe
    if (!doc) {
      return this.getOrCreate(params);
    }

    doc.assertNotLocked();
    return doc;
  }

  async fail(
    doc: AuthThrottleDocument,
    opts: { maxAttempts: number; lockMinutes: number },
  ) {
    doc.recordFailure(opts.maxAttempts, opts.lockMinutes);
    await doc.save();
  }

  async success(doc: AuthThrottleDocument) {
    doc.recordSuccess();
    await doc.save();
  }
}