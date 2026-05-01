self.addEventListener('push', (event: any) => {
  const payload = event.data?.json?.() ?? { title: '알림', body: '새 소식이 있습니다.' };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: payload.url,
    }),
  );
});

self.addEventListener('notificationclick', (event: any) => {
  const url = event.notification?.data || '/';
  event.notification.close();
  event.waitUntil(self.clients.openWindow(url));
});
