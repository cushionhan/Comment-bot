export interface QueueClient {
  enqueue(name: string, payload: Record<string, unknown>): Promise<void>;
}

export class BullMqQueueClient implements QueueClient {
  async enqueue(name: string, payload: Record<string, unknown>): Promise<void> {
    // BullMQ integration skeleton
    void name;
    void payload;
  }
}
