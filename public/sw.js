const CACHE_NAME = "OkvTunesCache";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/offline",
        "/_next/static/chunks/app/offline/page.js",
        "/android-chrome-192x192.png",
        "/android-chrome-512x512.png",
        "/apple-touch-icon.png",
        "/logo-circle.svg",
        "/favicon.ico",
        "/logo-full.svg",
        "/maskable_icon_x512.png",
        "/screenshot.webp",
        "/manifest.webmanifest",
      ]);
    })
  );
  self.skipWaiting();
});

async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name_1) => caches.delete(name_1))
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(async () => {
      // If the fetch fails (e.g., user is offline), serve the offline page from the cache
      const cache = await caches.open(CACHE_NAME);
      return cache.match("/offline");
    })
  );
});
