import { createSlice } from "@reduxjs/toolkit";
import { NotificationState } from "./types";
import {
  fetchNotificationsThunk,
  fetchUnreadNotificationsThunk,
  fetchUnreadCountThunk,
  markAsReadThunk,
  markAllAsReadThunk,
  deleteNotificationThunk,
} from "./thunks";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch all notifications
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      });

    // Fetch unread notifications
    builder
      .addCase(fetchUnreadNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchUnreadNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch unread notifications";
      });

    // Fetch unread count
    builder.addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
    });

    // Mark as read
    builder.addCase(markAsReadThunk.fulfilled, (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );
      if (notification) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // Mark all as read
    builder.addCase(markAllAsReadThunk.fulfilled, (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    });

    // Delete notification
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload,
      );
    });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
