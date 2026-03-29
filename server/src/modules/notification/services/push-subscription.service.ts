import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    PushSubscription,
    PushSubscriptionDocument,
} from '../../../database/entities/push-subscription.entity';

@Injectable()
export class PushSubscriptionService {
    constructor(
        @InjectModel(PushSubscription.name)
        private readonly pushSubscriptionModel: Model<PushSubscriptionDocument>,
    ) { }

    async save(userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) {
        await this.pushSubscriptionModel.findOneAndUpdate(
            {
                userId: new Types.ObjectId(userId),
                endpoint: subscription.endpoint,
            },
            {
                userId: new Types.ObjectId(userId),
                endpoint: subscription.endpoint,
                keys: subscription.keys,
            },
            { upsert: true, new: true },
        );
    }

    async getByUserIds(userIds: string[]) {
        return this.pushSubscriptionModel.find({
            userId: { $in: userIds.map((id) => new Types.ObjectId(id)) },
        });
    }
}