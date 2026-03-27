import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification, INotificationMeta, FetchNotificationsData } from "../notification.types";
import { fetchNotifications } from "../thunks/fetch-notifications.thunk";
import { fetchUnreadCount } from "../thunks/fetch-unread-count.thunk";
import { markNotificationAsRead } from "../thunks/mark-as-read.thunk";
import { markAllNotificationsAsRead } from "../thunks/mark-all-as-read.thunk";
import { deleteNotification } from "../thunks/delete-notification.thunk";
import { deleteAllNotifications } from "../thunks/delete-all-notifications.thunk";

// ─── State ────────────────────────────────────────────────
interface NotificationState {
    notifications: INotification[];
    meta: INotificationMeta;
    unreadCount: number;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
}

const initialMeta: INotificationMeta = {
    total: 0,
    unreadCount: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
};

const initialState: NotificationState = {
    notifications: [],
    meta: initialMeta,
    unreadCount: 0,
    isLoading: false,
    isUpdating: false,
    error: null,
};

// ─── Slice ────────────────────────────────────────────────
const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        // Error manually clear
        clearError(state) {
            state.error = null;
        },

        // Logout এ state reset
        resetNotifications() {
            return initialState;
        },
    },
    extraReducers: (builder) => {

        // ─── Fetch All ────────────────────────────────────
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchNotifications.fulfilled,
                (state, action: PayloadAction<FetchNotificationsData>) => {
                    state.isLoading = false;
                    state.notifications = action.payload.data;
                    state.meta = action.payload.meta;
                    state.unreadCount = action.payload.meta.unreadCount;
                }
            )
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message ?? "Something went wrong";
            });

        // ─── Fetch Unread Count ───────────────────────────
        builder
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.count;
            });

        // ─── Mark Single as Read ──────────────────────────
        builder
            .addCase(markNotificationAsRead.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.isUpdating = false;
                const notification = state.notifications.find(
                    (n) => n._id === action.payload.id
                );
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    notification.readAt = new Date().toISOString();
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload?.message ?? "Failed to mark as read";
            });

        // ─── Mark All as Read ─────────────────────────────
        builder
            .addCase(markAllNotificationsAsRead.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.isUpdating = false;
                state.notifications.forEach((n) => {
                    n.isRead = true;
                    n.readAt = new Date().toISOString();
                });
                state.unreadCount = 0;
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload?.message ?? "Failed to mark all as read";
            });

        // ─── Delete Single ────────────────────────────────
        builder
            .addCase(deleteNotification.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.isUpdating = false;
                const index = state.notifications.findIndex(
                    (n) => n._id === action.payload.notificationId
                );
                if (index !== -1) {
                    const isUnread = !state.notifications[index].isRead;
                    state.notifications.splice(index, 1);
                    state.meta.total = Math.max(0, state.meta.total - 1);
                    if (isUnread) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                }
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload?.message ?? "Failed to delete notification";
            });

        // ─── Delete All ───────────────────────────────────
        builder
            .addCase(deleteAllNotifications.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(deleteAllNotifications.fulfilled, (state) => {
                state.isUpdating = false;
                state.notifications = [];
                state.meta = initialMeta;
                state.unreadCount = 0;
            })
            .addCase(deleteAllNotifications.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload?.message ?? "Failed to delete all notifications";
            });
    },
});

export const { clearError, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;