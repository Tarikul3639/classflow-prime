/* eslint-disable no-restricted-globals */

// Listen for push notifications
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ClassFlow';
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    data: data.data || {},
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const redirectUrl = event.notification.data?.redirectUrl || '/classroom';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if a ClassFlow window is already open
        for (let client of clientList) {
          if (client.url.includes(redirectUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open a new window
        if (clients.openWindow) {
          return clients.openWindow(redirectUrl);
        }
      }),
    );
  }
});

// Background sync for offline notifications (optional)
self.addEventListener('sync', function (event) {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      // Fetch new notifications when back online
      fetch('/api/notifications/unread/count')
        .then((response) => response.json())
        .then((data) => {
          if (data.count > 0) {
            return self.registration.showNotification('ClassFlow', {
              body: `You have ${data.count} new notification(s)`,
              icon: '/favicon.ico',
            });
          }
        })
        .catch((err) => console.error('Sync failed:', err)),
    );
  }
});

console.log('[Service Worker] Push notification service worker loaded');
