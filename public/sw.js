const CACHE_NAME = "OkvTunesCache";
const DB_NAME = "OkvTunes";
const DB_VERSION = 1;
const DB_STORE_NAME = "myStore";
const MAX_CACHE_SIZE = 50; // Example limit
const TTL = 3600 * 1000; // 1 hour in milliseconds

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/android-chrome-192x192.png",
        "/android-chrome-512x512.png",
        "/apple-touch-icon.png",
        "/logo-circle.svg",
        "/logo-full.svg",
        "/maskable_icon_x512.png",
        "/screenshot.webp",
        "/manifest.webmanifest",
        "/offline",
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

async function limitCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_SIZE) {
    await cache.delete(keys[0]);
  }
}

async function addToCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  const timestampedResponse = new Response(response.body, {
    headers: { ...response.headers, "sw-fetched-at": Date.now() },
  });
  await cache.put(request, timestampedResponse);
  await limitCacheSize();
}

async function getFromCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    const fetchedAt = cachedResponse.headers.get("sw-fetched-at");
    if (fetchedAt && Date.now() - fetchedAt > TTL) {
      await cache.delete(request);
      return null;
    }
    return cachedResponse;
  }
  return null;
}

async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await getFromCache(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    await addToCache(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return caches.match("/offline");
  }
}

async function dynamicCaching(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    await addToCache(request, response.clone());
    return response;
  } catch (error) {
    console.error("Dynamic caching failed:", error);
    return caches.match("/offline");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (event.request.method === "navigate") {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});
