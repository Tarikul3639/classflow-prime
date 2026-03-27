import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    Notification,
    NotificationDocument,
    NotificationType,
} from '../../../database/entities/notification.entity';
import {
    CreateNotificationDto,
    CreateBulkNotificationDto,
} from '../dto/create-notification.dto';
import { QueryNotificationDto } from '../dto/query-notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
    ) { }

    // ─── Single Create ────────────────────────────────────────
    async create(dto: CreateNotificationDto): Promise<Notification> {
        return this.notificationModel.create(dto);
    }

    // ─── Bulk Create ──────────────────────────────────────────
    async createBulk(dto: CreateBulkNotificationDto): Promise<void> {
        if (!dto.recipientIds.length) return;

        const { recipientIds, ...rest } = dto;

        await this.notificationModel.insertMany(
            recipientIds.map((recipientId) => ({ ...rest, recipientId })),
            { ordered: false },
        );
    }

    // ─── Get Paginated List ───────────────────────────────────
    async getUserNotifications(userId: string, query: QueryNotificationDto) {
        console.log("Call for all notifications: ", userId);
        const { page = 1, limit = 20, onlyUnread, type } = query;
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {
            recipientId: new Types.ObjectId(userId),
        };

        if (onlyUnread) filter.isRead = false;
        if (type) filter.type = type;

        const [data, total, unreadCount] = await Promise.all([
            this.notificationModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            this.notificationModel.countDocuments(filter),

            // For bell badge count (ignoring pagination filters)
            this.notificationModel.countDocuments({
                recipientId: new Types.ObjectId(userId),
                isRead: false,
            }),
        ]);

        // If DB returns null/undefined, then return mock data instead (to avoid frontend errors)
        // const fallbackData = [
        //     {
        //         _id: new Types.ObjectId(), // temporary ObjectId
        //         recipientId: new Types.ObjectId(userId),
        //         senderId: null,
        //         title: "Welcome to ClassFlow!",
        //         message: "You don't have any notifications yet.",
        //         type: NotificationType.UPDATE,
        //         isRead: true,
        //         readAt: new Date(),
        //         metadata: {},
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //     },
        //     {
        //         _id: new Types.ObjectId(), // temporary ObjectId
        //         recipientId: new Types.ObjectId(userId),
        //         senderId: null,
        //         title: "No notifications",
        //         message: "You're all caught up! Check back later for updates.",
        //         type: NotificationType.MATERIAL,
        //         isRead: false,
        //         readAt: new Date(),
        //         metadata: {},
        //         createdAt: new Date('2026-03-25T12:00:00Z'),
        //         updatedAt: new Date(),
        //     }
        // ];

        return {
            success: true,
            message: 'Notifications fetched successfully',
            data: {
                data,
                meta: {
                    total,
                    unreadCount,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasMore: skip + data.length < total,
                },
            },
        };
    }

    // ─── Unread Count Only (Bell badge) ───────────────────────
    async getUnreadCount(userId: string) {
        const count = await this.notificationModel.countDocuments({
            recipientId: new Types.ObjectId(userId),
            isRead: false,
        });

        return {
            success: true,
            message: 'Unread count fetched successfully',
            data: {
                count,
            }
        }
    }

    // ─── Mark Single as Read ──────────────────────────────────
    async markAsRead(notificationId: string, userId: string): Promise<void> {
        await this.notificationModel.updateOne(
            {
                _id: new Types.ObjectId(notificationId),
                recipientId: new Types.ObjectId(userId),
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
            },
        );
    }

    // ─── Mark All as Read ─────────────────────────────────────
    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationModel.updateMany(
            {
                recipientId: new Types.ObjectId(userId),
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
            },
        );
    }

    // ─── Delete Single ────────────────────────────────────────
    async deleteOne(notificationId: string, userId: string): Promise<void> {
        await this.notificationModel.deleteOne({
            _id: new Types.ObjectId(notificationId),
            recipientId: new Types.ObjectId(userId),
        });
    }

    // ─── Delete All ───────────────────────────────────────────
    async deleteAll(userId: string): Promise<void> {
        await this.notificationModel.deleteMany({
            recipientId: new Types.ObjectId(userId),
        });
    }
}