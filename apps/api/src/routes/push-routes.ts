import { PushSendService } from '../modules/push/push-send-service';
import { PushSubscriptionRepository } from '../modules/push/types';

type Request = {
  params?: Record<string, string>;
  body?: any;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

export function createPushRoutes(repository: PushSubscriptionRepository, pushSendService: PushSendService) {
  return {
    subscribe: async (req: Request, res: Response) => {
      const userId = req.params?.userId;
      const subscription = req.body?.subscription;

      if (!userId || !subscription) {
        return res.status(400).json({ error: 'userId and subscription are required' });
      }

      await repository.save(userId, subscription);
      return res.status(201).json({ ok: true });
    },

    processingCompleted: async (req: Request, res: Response) => {
      const userId = req.params?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const result = await pushSendService.notifyProcessingCompleted(userId, {
        title: '리뷰 처리 완료',
        body: '요청하신 리뷰 답글 처리가 완료되었습니다.',
        url: '/history',
      });

      return res.status(200).json({ ok: true, ...result });
    },
  };
}
