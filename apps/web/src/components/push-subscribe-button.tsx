'use client';

import { useState } from 'react';
import { subscribePush } from '../features/push/subscribe';

export function PushSubscribeButton({ userId }: { userId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const onSubscribe = async () => {
    setStatus('loading');
    try {
      await subscribePush(userId);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <button onClick={onSubscribe} disabled={status === 'loading'}>
        {status === 'loading' ? '등록 중...' : '푸시 알림 구독'}
      </button>
      {status === 'done' && <p>구독 완료</p>}
      {status === 'error' && <p>구독 실패</p>}
    </div>
  );
}
