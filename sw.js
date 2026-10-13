const C='anima-quieta-v6';const F=['./','index.html','style.css','app.js','audio.js','advice.js','advice_en.js','advice_fr.js','i18n.js','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
if(r.mode==='navigate'){e.respondWith(fetch(r).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put('index.html',cp));return n}).catch(()=>caches.match('index.html')));return}
e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(n=>{const cp=n.clone();caches.open(C).then(x=>x.put(r,cp));return n})))});
