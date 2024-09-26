const CACHE_NAME = "OkvTunesCache";
// const cachePaths = ["/", "/chart", "/artists", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/offline",
        "/android-chrome-192x192.png",
        "/android-chrome-512x512.png",
        "/apple-touch-icon.png",
        "/logo-circle.svg",
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
  return await Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name_1) => caches.delete(name_1))
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    // const responseClone = networkResponse.clone();
    // // await cache.put(request, responseClone);
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match("/offline");
    return cachedResponse;
  }
}

async function dynamicCaching(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(request);
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    console.error("Dynamic caching failed:", error);
    if (error instanceof Error) {
      console.log(error.stack);
    }
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match("/offline");
    return cachedResponse;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  event.respondWith(cacheFirstStrategy(request));
});
