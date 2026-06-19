/**
 * @typedef {Object} PushNotification
 * @property {string} title
 * @property {string} body
 * @property {string} [icon]
 * @property {string} [badge]
 */

/**
 * @typedef {Object} PushData
 * @property {string} [classId]
 * @property {string} [updateId]
 * @property {string} [materialId]
 * @property {string} [url]
 */

/**
 * @typedef {Object} PushPayload
 * @property {PushNotification} notification
 * @property {PushData} data
 */

// ─────────────────────────────────────────────
// LIFECYCLE EVENTS
// ─────────────────────────────────────────────

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ─────────────────────────────────────────────
// PUSH EVENT
// ─────────────────────────────────────────────

self.addEventListener("push", (event) => {
  /** @type {PushPayload} */
  let payload = {
    notification: { title: "New Notification", body: "" },
    data: {},
  };

  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (err) {
    console.error("[SW] Invalid push data:", err);
  }

  const { title, body, icon = "/favicon.ico", badge = "/favicon.ico" } = payload.notification;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: payload.data,
      tag: payload.data?.updateId,
      renotify: true,
    })
  );
});

// ─────────────────────────────────────────────
// NOTIFICATION CLICK
// ─────────────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { classId, updateId, materialId, url } = event.notification.data || {};
  let targetUrl = url || "/notifications";

  // Determine navigation URL
  if (!url) {
    if (classId && updateId) targetUrl = `/classes/${classId}/updates?updateId=${updateId}`;
    else if (classId && materialId) targetUrl = `/classes/${classId}/materials?materialId=${materialId}`;
    else if (classId) targetUrl = `/classes/${classId}`;
  }

  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });

      // Try to focus existing tab
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin)) {
          client.postMessage({ type: "NOTIFICATION_CLICK", url: targetUrl });
          return client.focus();
        }
      }
      // Open new window if no tab found
      return clients.openWindow(absoluteUrl);
    })()
  );
});