// Bump CACHE_VERSION whenever any app file changes.
const CACHE_VERSION = "pakiza-ot-v19", FIREBASE_CACHE = "linkon-firebase";
const FILES = ["./", "index.html", "style.css", "app.js", "manifest.json", "icon-192.png", "icon-512.png", "banner.jpg", "profile.jpg", "cloud.js", "firebase-config.js", "i18n.js", "helpline-config.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION && k !== FIREBASE_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) {   // keep Firebase scripts so sign-in works offline after the first visit
    e.respondWith(caches.open(FIREBASE_CACHE).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
