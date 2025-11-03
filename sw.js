// ================================
// SERVICE WORKER - TurkAmerica PWA
// ================================

const CACHE_VERSION = 'turkamerica-v1.0.0';
const CACHE_NAMES = {
    static: `${CACHE_VERSION}-static`,
    dynamic: `${CACHE_VERSION}-dynamic`,
    images: `${CACHE_VERSION}-images`
};

const STATIC_CACHE_URLS = [
    '/build/',                       
    '/build/Gramatica.html',
    '/build/Perfil.html',
    '/build/css/styles.css',
    '/build/css/darkmode.css',
    '/build/js/config.js',
    '/build/js/general.js',
    '/build/auth/auth.js',
    '/build/manifest.json'          
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAMES.static)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Error caching static assets:', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return cacheName.startsWith('turkamerica-') &&
                                   !Object.values(CACHE_NAMES).includes(cacheName);
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip API requests (always fetch fresh)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.error('[SW] API request failed:', error);
                    return new Response(
                        JSON.stringify({
                            error: 'Network error',
                            message: 'Unable to reach server'
                        }),
                        {
                            status: 503,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
        return;
    }

    // Handle different types of resources
    if (request.destination === 'image') {
        event.respondWith(cacheFirst(request, CACHE_NAMES.images));
    } else if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font'
    ) {
        event.respondWith(cacheFirst(request, CACHE_NAMES.static));
    } else {
        event.respondWith(networkFirst(request, CACHE_NAMES.dynamic));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
    try {
        const url = new URL(request.url);
        
        // 1. Initial Protocol Check (Prevent match/fetch for unsupported schemes)
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            console.log('[SW] Skipping cache logic for non-http(s) protocol:', url.protocol);
            return fetch(request);
        }
        
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Update cache in background
            fetch(request)
                .then((response) => {
                    // **!!! SECOND CRITICAL FIX IMPLEMENTED HERE !!!**
                    // The request object in the background fetch might still be an unsupported scheme
                    // due to an intercept. Must check before 'put'.
                    const backgroundUrl = new URL(request.url);
                    if (backgroundUrl.protocol !== 'http:' && backgroundUrl.protocol !== 'https:') {
                        return; // Bail out of background update if protocol is unsupported
                    }
                    
                    if (response && response.status === 200) {
                        cache.put(request, response.clone());
                    }
                })
                .catch(() => {
                    // Silently fail background update
                });

            return cachedResponse;
        }

        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            // No need to check protocol here, as the first check already handled it
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first error:', error);
        return new Response('Offline - Asset not cached', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network-first strategy (for HTML pages)
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page
        return new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - TurkAmerica</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .offline-container {
                        max-width: 500px;
                    }
                    h1 {
                        font-size: 3rem;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 1.2rem;
                        opacity: 0.9;
                    }
                    .icon {
                        font-size: 5rem;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="icon">📡</div>
                    <h1>Sin Conexión</h1>
                    <p>No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.</p>
                    <button onclick="window.location.reload()" style="
                        margin-top: 30px;
                        padding: 12px 30px;
                        background: white;
                        color: #667eea;
                        border: none;
                        border-radius: 25px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        Reintentar
                    </button>
                </div>
            </body>
            </html>
        `, {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Implement background sync logic here
    console.log('[SW] Syncing data...');
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'TurkAmerica';
    const options = {
        body: data.body || 'Nueva notificación',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();

    if (event.action === 'open') {
        const urlToOpen = event.notification.data || '/';
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((windowClients) => {
                    // Check if there's already a window open
                    for (let client of windowClients) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Open new window
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    }
});

console.log('[SW] Service Worker loaded');