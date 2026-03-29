self.addEventListener("push", (event) => {
  console.log("[sw-push] Push event received:", event); // Debug log to check the event data

  const data = event.data.json();
  console.log('[sw-push] Push data:', data);
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      data: data.data,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const classId = event.notification.data?.classId;
  if (classId) {
    event.waitUntil(clients.openWindow(`/classes/${classId}`));
  }
});
