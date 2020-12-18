/**
 * Simple Service Worker, caching static content.
 * 
 * version: 2020.12.12 10:57
 */
const version = '1.0.4';
var cacheName = 'planelauncher.v1.0.4';
var cacheFiles = [
    '/index.html',
    '/javascripts/scripts.js',
    '/stylesheets/style.css',
    '/stylesheets/style.css.map',
    '/images/paper_plane.png',
    '/images/icon_192.png',
    '/images/icon_512.png',
    '/docs/readme.md',
    '/docs/styles.css',
    '/docs/template.html',
    '/docs/screenshots/actions_screenshot_0.jpg',
    '/docs/screenshots/actions_screenshot_1.jpg',
    '/docs/screenshots/actions_screenshot_2.jpg',
    '/docs/screenshots/plane_launcher_sm.jpg',
    '/docs/screenshots/web_screenshot_1.jpg'    
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');

    e.waitUntil(
      caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: cacheFiles');
        return cache.addAll(cacheFiles);
      })
    );
  });

  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
    );
  });

  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
        return r || fetch(e.request).then((response) => {
                  return caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching new resource: '+e.request.url);
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  });