// ─────────────────────────────────────────────
// INSTALL & ACTIVATE
// ─────────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ─────────────────────────────────────────────
// PUSH EVENT
// ─────────────────────────────────────────────
self.addEventListener("push", (event) => {
  console.log("[sw] raw data:", event.data?.text());
  let payload = {
    notification: { title: "New Notification", body: "" },
    data: {},
  };

  try {
    payload = event.data ? event.data.json() : payload;
  } catch (err) {
    console.error("[sw] Invalid push data:", err);
  }

  const { title, body, icon, badge } = payload.notification;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon ?? "/icon.png",
      badge: badge ?? "/icon.png",
      data: payload.data, // classId, updateId, materialId, url etc. for routing on click
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { classId, updateId, materialId, url } = event.notification.data || {};

  // ── Field presence route build ──
  let targetUrl = url || "/notifications"; // url already built

  if (!url) {
    if (classId && updateId) {
      targetUrl = `/classes/${classId}/updates?updateId=${updateId}`;
    } else if (classId && materialId) {
      targetUrl = `/classes/${classId}/materials?materialId=${materialId}`;
    } else if (classId) {
      targetUrl = `/classes/${classId}`;
    }
  }

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if ("focus" in client) {
          await client.navigate(targetUrl);
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })(),
  );
});
