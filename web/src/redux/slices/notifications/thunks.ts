import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { Notification } from "./types";

// Fetch all notifications
export const fetchNotificationsThunk = createAsyncThunk<
  Notification[],
  { limit?: number; skip?: number },
  { rejectValue: string }
>(
  "notifications/fetchAll",
  async ({ limit = 50, skip = 0 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ data: Notification[] }>(
        `/notifications?limit=${limit}&skip=${skip}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// Fetch unread notifications
export const fetchUnreadNotificationsThunk = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchUnread", async (_, { rejectWithValue }) => {
  try {
    console.log("🔄 Fetching unread notifications...");
    const response = await apiClient.get<{ data: Notification[] }>(
      "/notifications/unread",
    );
    console.log("✅ Unread notifications response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch unread notifications:", error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch unread notifications",
    );
  }
});

// Fetch unread count
export const fetchUnreadCountThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("notifications/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    console.log("🔄 Fetching unread count...");
    const response = await apiClient.get<{ count: number }>(
      "/notifications/unread/count",
    );
    console.log("✅ Unread count response:", response.data);
    return response.data.count;
  } catch (error: any) {
    console.error("❌ Failed to fetch unread count:", error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch unread count",
    );
  }
});

// Mark as read
export const markAsReadThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/markAsRead", async (notificationId, { rejectWithValue }) => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/read`);
    return notificationId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark as read",
    );
  }
});

// Mark all as read
export const markAllAsReadThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    await apiClient.patch("/notifications/read-all");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark all as read",
    );
  }
});

// Delete notification
export const deleteNotificationThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/delete", async (notificationId, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/notifications/${notificationId}`);
    return notificationId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete notification",
    );
  }
});
