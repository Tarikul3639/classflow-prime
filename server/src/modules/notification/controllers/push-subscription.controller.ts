import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PushSubscriptionService } from '../services/push-subscription.service';

@Controller('notifications')
export class PushSubscriptionController {
    constructor(
        private readonly pushSubscriptionService: PushSubscriptionService,
    ) { }

    @Post('subscribe')
    @HttpCode(HttpStatus.OK)
    async subscribe(
        @Body() body: { userId: string; subscription: PushSubscriptionDto },
    ) {
        await this.pushSubscriptionService.save(body.userId, body.subscription);
        return { success: true, message: 'Push subscription saved' };
    }
}

interface PushSubscriptionDto {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}