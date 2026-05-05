const sw = globalThis as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event: PushEvent) => {
  const payload = event.data?.json?.() ?? { title: '알림', body: '새 소식이 있습니다.' };

  event.waitUntil(
    sw.registration.showNotification(payload.title, {
      body: payload.body,
      data: payload.url,
    }),
  );
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  const url = event.notification?.data || '/';
  event.notification.close();
  event.waitUntil(sw.clients.openWindow(url));
});
