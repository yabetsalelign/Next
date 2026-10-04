// Service Worker for Next (Personal Planner PWA)
// Strategy:
//   - App shell assets (JS/CSS): cache-first, update in background
//   - Navigation (HTML pages): network-first, fall back to cached page
//   - Everything else: network-first, no cache

const CACHE_NAME = 'next-planner-v2';

// Pages to pre-cache on install (app shell)
const PRECACHE_URLS = [
  '/',
  '/plan',
  '/routines',
  '/history',
  '/settings',
];

// ----- Install: pre-cache app shell pages -----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache pages best-effort; don't fail install if one is unavailable
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW] Failed to pre-cache:', url, err)
          )
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ----- Activate: clean up old caches -----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ----- Fetch: routing logic -----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Next.js internal routes (_next/webpack-hmr, _next/data, etc.)
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;
  if (url.pathname.startsWith('/api/')) return;

  // Static assets (_next/static/): cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Static files in /public (icons, manifest, etc.): cache-first
  if (
    url.pathname.startsWith('/icon-') ||
    url.pathname.startsWith('/apple-touch-icon') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/favicon.ico'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation requests (HTML pages): network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Everything else: network-first, no caching
  event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first, fall back to cached page
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Last resort: return the root page for any nav request
    const rootCache = await caches.match('/');
    if (rootCache) return rootCache;

    return new Response('<h1>You are offline</h1><p>Open the app when you have a connection to load it.</p>', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
