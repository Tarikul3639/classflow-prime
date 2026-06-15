// ─────────────────────────────────────────────
// INSTALL & ACTIVATE
// ─────────────────────────────────────────────
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ─────────────────────────────────────────────
// PUSH EVENT
// ─────────────────────────────────────────────
self.addEventListener("push", (event) => {
  const defaultPayload = {
    notification: { title: "New Notification", body: "" },
    data: {},
  };

  let payload = defaultPayload;
  try {
    payload = event.data ? event.data.json() : defaultPayload;
  } catch (err) {
    console.error("[sw] Invalid push data:", err);
  }

  const { title, body, icon, badge } = payload.notification;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || "/icon.png",
      badge: badge || "/icon.png",
      data: payload.data,
    }),
  );
});

// ─────────────────────────────────────────────
// NOTIFICATION CLICK
// ─────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { classId, updateId, materialId, url } = event.notification.data || {};

  // URL Resolution Logic
  let targetUrl = url || "/notifications";
  if (!url) {
    if (classId && updateId)
      targetUrl = `/classes/${classId}/updates?updateId=${updateId}`;
    else if (classId && materialId)
      targetUrl = `/classes/${classId}/materials?materialId=${materialId}`;
    else if (classId) targetUrl = `/classes/${classId}`;
  }

  const absoluteUrl = `${self.location.origin}${targetUrl}`;

  event.waitUntil(
    (async () => {
      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Try to focus existing window
      for (const client of clientList) {
        if ("focus" in client) {
          client.postMessage({ type: "NOTIFICATION_CLICK", url: targetUrl });
          return client.focus();
        }
      }

      // If no window found, open new one
      return clients.openWindow(absoluteUrl);
    })(),
  );
});
