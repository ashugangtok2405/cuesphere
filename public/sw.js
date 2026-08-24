async function updateBadgeFromNotifications() {
  if (!self.navigator?.setAppBadge) return;
  try {
    const notifications = await self.registration.getNotifications();
    if (notifications.length > 0) {
      await self.navigator.setAppBadge(notifications.length);
    } else {
      await self.navigator.clearAppBadge();
    }
  } catch {
    // Badging API not supported here — ignore.
  }
}

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "CueSphere", body: event.data.text() };
  }

  const { title, body, url, icon } = payload;

  event.waitUntil(
    self.registration
      .showNotification(title || "CueSphere", {
        body: body || "",
        icon: icon || "/branding/cuesphere-icon.png",
        badge: "/branding/cuesphere-icon.png",
        data: { url: url || "/" },
      })
      .then(updateBadgeFromNotifications)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    Promise.all([
      updateBadgeFromNotifications(),
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
    ])
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "clear-badge") {
    event.waitUntil(
      self.registration.getNotifications().then((notifications) => {
        notifications.forEach((n) => n.close());
        return self.navigator?.clearAppBadge?.();
      })
    );
  }
});
