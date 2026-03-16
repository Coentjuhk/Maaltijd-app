const CACHE = 'maaltijd-v7';
const FILES = [
  './index.html', './styles.css', './app.js', './manifest.json', './icon.svg',
  './images/kip-zoete-aardappel.png',
  './images/zalm-quinoa.png',
  './images/kip-bolognese.png',
  './images/griekse-kip-couscous.png',
  './images/tofu-roerbak.png',
  './images/rundergehakt-paprika.png',
  './images/rijstnoedels-kip.png',
  './images/kip-teriyaki.png',
  './images/chili-con-carne.png',
  './images/kip-curry.png',
  './images/turkse-gehakt-schotel.png',
  './images/kwark-muesli-bessen.png',
  './images/ontbijt-shake.png',
  './images/tosti-kip-kaas.png',
  './images/kipfilet-wrap.png',
  './images/kwark-honing.png',
  './images/eiwitshake.png',
  './images/banaan.png',
  './images/gekookt-ei.png',
  './images/handje-nootjes.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
