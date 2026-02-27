export interface Notification {
  _id: string;
  userId: string;
  classroomId: {
    _id: string;
    name: string;
  };
  referenceId?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}
