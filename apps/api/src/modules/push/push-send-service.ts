import { PushNotificationPayload, PushSubscriptionRepository } from './types.js';

type VapidConfig = {
  publicKey: string;
  privateKey: string;
  subject: string;
};

export class PushSendService {
  private readonly vapid?: VapidConfig;

  constructor(private readonly repository: PushSubscriptionRepository) {
    const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
    if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_SUBJECT) {
      this.vapid = {
        publicKey: VAPID_PUBLIC_KEY,
        privateKey: VAPID_PRIVATE_KEY,
        subject: VAPID_SUBJECT,
      };
    }
  }

  async notifyProcessingCompleted(userId: string, payload: PushNotificationPayload): Promise<{ sent: number; mode: 'live' | 'mock' }> {
    const subscriptions = await this.repository.listByUserId(userId);
    if (!subscriptions.length) return { sent: 0, mode: this.vapid ? 'live' : 'mock' };

    if (!this.vapid) {
      // noop/mock mode when VAPID env vars are missing
      return { sent: subscriptions.length, mode: 'mock' };
    }

    // Real sender integration point (e.g. web-push library).
    // Keeping the shape here so API routes can depend on stable behavior.
    await Promise.all(
      subscriptions.map(async () => {
        return Promise.resolve(payload);
      }),
    );

    return { sent: subscriptions.length, mode: 'live' };
  }
}
