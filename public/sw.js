/**
 * Service Worker for MindForge PWA
 * Handles caching, offline functionality, and background sync
 */

const CACHE_NAME = 'mindforge-v1.0.0';
const DATA_CACHE_NAME = 'mindforge-data-v1.0.0';

// Files to cache for offline functionality
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints that should be cached
const DATA_URLS = [
  '/api/',
  '/puzzles/',
  '/progress/'
];

/**
 * Install event - cache static resources
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((thisCacheName) => {
          if (thisCacheName !== CACHE_NAME && thisCacheName !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', thisCacheName);
            return caches.delete(thisCacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
  // Handle data requests separately
  if (isDataRequest(event.request.url)) {
    event.respondWith(handleDataRequest(event.request));
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  // Handle other requests (CSS, JS, images)
  event.respondWith(handleResourceRequest(event.request));
});

/**
 * Check if request is for data/API
 */
function isDataRequest(url) {
  return DATA_URLS.some(dataUrl => url.includes(dataUrl));
}

/**
 * Handle data requests with network-first strategy
 */
async function handleDataRequest(request) {
  try {
    // Try network first for fresh data
    const response = await fetch(request);

    if (response.status === 200) {
      // Cache successful responses
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    console.log('[ServiceWorker] Network failed, trying cache for:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for data requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'No cached data available',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

/**
 * Handle navigation requests
 */
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Network failed, serve cached index.html
    console.log('[ServiceWorker] Navigation request failed, serving cached page');

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/index.html');

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback offline page
    return new Response(
      createOfflinePage(),
      {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );
  }
}

/**
 * Handle resource requests with cache-first strategy
 */
async function handleResourceRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Resource request failed:', request.url);

    // Return appropriate fallback based on request type
    if (request.destination === 'image') {
      return createFallbackImage();
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * Create offline page HTML
 */
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MindForge - Offline</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                margin: 0;
                padding: 2rem;
                background: linear-gradient(135deg, #3498db, #8e44ad);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .offline-container {
                max-width: 500px;
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            p {
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .retry-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                padding: 1rem 2rem;
                font-size: 1.1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .retry-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 2rem;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="icon">🧠</div>
            <h1>MindForge</h1>
            <p>You're currently offline, but you can still access your saved progress and continue with cached puzzles.</p>
            <button class="retry-btn" onclick="window.location.reload()">
                Try Again
            </button>
        </div>
    </body>
    </html>
  `;
}

/**
 * Create fallback image for failed image requests
 */
function createFallbackImage() {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e9ecef"/>
      <text x="100" y="100" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle" dominant-baseline="middle">
        Image offline
      </text>
    </svg>
  `;

  return new Response(svg, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  });
}

/**
 * Background sync for analytics and progress
 */
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }

  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

/**
 * Sync analytics data when online
 */
async function syncAnalytics() {
  try {
    // Get stored analytics data from IndexedDB or localStorage
    const analyticsData = await getStoredAnalytics();

    if (analyticsData && analyticsData.length > 0) {
      // Send to analytics endpoint
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData)
      });

      if (response.ok) {
        // Clear stored analytics data
        await clearStoredAnalytics();
        console.log('[ServiceWorker] Analytics synced successfully');
      }
    }
  } catch (error) {
    console.log('[ServiceWorker] Analytics sync failed:', error);
  }
}

/**
 * Sync progress data when online
 */
async function syncProgress() {
  try {
    // Get stored progress data
    const progressData = await getStoredProgress();

    if (progressData) {
      // Send to progress endpoint
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData)
      });

      if (response.ok) {
        console.log('[ServiceWorker] Progress synced successfully');
      }
    }
  } catch (error) {
    console.log('[ServiceWorker] Progress sync failed:', error);
  }
}

/**
 * Get stored analytics data
 */
async function getStoredAnalytics() {
  try {
    const data = localStorage.getItem('mindforge_analytics');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Clear stored analytics data
 */
async function clearStoredAnalytics() {
  try {
    localStorage.removeItem('mindforge_analytics');
  } catch (error) {
    console.log('Failed to clear analytics data:', error);
  }
}

/**
 * Get stored progress data
 */
async function getStoredProgress() {
  try {
    const data = localStorage.getItem('mindforge_save');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');

  const options = {
    body: event.data ? event.data.text() : 'Time for your daily logic challenge!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open MindForge',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification('MindForge', options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');

  event.notification.close();

  if (event.action === 'open') {
    // Open the app
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window if not open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

/**
 * Handle messages from the main app
 */
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'SCHEDULE_SYNC') {
    // Schedule background sync
    self.registration.sync.register(event.data.tag);
  }
});

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('periodicsync', (event) => {
  console.log('[ServiceWorker] Periodic sync:', event.tag);

  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

/**
 * Send daily reminder notification
 */
async function sendDailyReminder() {
  const lastVisit = await getLastVisitTime();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (now - lastVisit > oneDayMs) {
    self.registration.showNotification('Daily Challenge Available!', {
      body: 'Your brain is ready for today\'s logic challenge. Come back and continue your journey!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'daily-challenge',
      requireInteraction: false
    });
  }
}

/**
 * Get last visit time from storage
 */
async function getLastVisitTime() {
  try {
    const data = localStorage.getItem('mindforge_last_visit');
    return data ? parseInt(data) : 0;
  } catch (error) {
    return 0;
  }
}

console.log('[ServiceWorker] Service Worker loaded');