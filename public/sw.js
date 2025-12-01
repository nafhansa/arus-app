const CACHE_VERSION = 'arus-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const keep = [STATIC_CACHE, RUNTIME_CACHE]
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

function isAsset(url) {
  return /\.(?:js|css|png|jpg|jpeg|svg|woff2?)$/i.test(url.pathname)
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET') return

  // Static assets: cache-first
  if (isAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((resp) => {
          const copy = resp.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, copy))
          return resp
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
    return
  }

  // API responses: stale-while-revalidate for dashboard/automations
  if (url.pathname.startsWith('/api/automations') || url.pathname.startsWith('/api/dashboard')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((resp) => {
            cache.put(event.request, resp.clone())
            return resp
          }).catch(() => cached)
          return cached || fetchPromise
        })
      })
    )
    return
  }

  // Navigation requests: network falling back to offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline'))
    )
    return
  }
})

