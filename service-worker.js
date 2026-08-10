const CACHE='keeper10-golden-v7-2-20260810';
const ASSETS=[
 './','./index.html','./styles.css?v=7','./app.js?v=7','./manifest.webmanifest?v=7',
 './k10_bereit_ablauf_v7.jpg','./k10_schritte_ablauf_v7.jpg','./k10_spring_ablauf_v7.jpg',
 './k10_bereit_clip_v7.mp4','./k10_schritte_clip_v7.mp4','./k10_spring_clip_v7.mp4','./k10-icon-192.png','./k10-icon-512.png'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==location.origin)return;
 const isDoc=e.request.mode==='navigate'||url.pathname.endsWith('.html')||url.pathname.endsWith('.js')||url.pathname.endsWith('.css');
 if(isDoc){e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));}
 else {e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;})));}
});
