const CACHE_NAME = 'PlayerWeb-v1.21';
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse; 
          } else {
            return fetch(event.request).then(networkResponse => {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
                return networkResponse;
             }); 
          }
        })
    );  
});