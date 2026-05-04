import { PushSubscriptionPayload, PushSubscriptionRepository } from './types.js';

export class InMemoryPushSubscriptionRepository implements PushSubscriptionRepository {
  private readonly store = new Map<string, PushSubscriptionPayload[]>();

  async save(userId: string, subscription: PushSubscriptionPayload): Promise<void> {
    const current = this.store.get(userId) ?? [];
    this.store.set(userId, [...current, subscription]);
  }

  async listByUserId(userId: string): Promise<PushSubscriptionPayload[]> {
    return this.store.get(userId) ?? [];
  }
}
