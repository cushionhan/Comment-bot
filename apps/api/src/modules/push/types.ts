export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type PushNotificationPayload = {
  title: string;
  body: string;
  url?: string;
};

export interface PushSubscriptionRepository {
  save(userId: string, subscription: PushSubscriptionPayload): Promise<void>;
  listByUserId(userId: string): Promise<PushSubscriptionPayload[]>;
}
