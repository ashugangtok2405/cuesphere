export type NotificationChannel = "website" | "email";

export interface Notification {
  id: string;
  userId: string;
  clubId: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
