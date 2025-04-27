const CACHE_NAME = 'NotepPages-V1';
// 请求拦截：网络不可用时返回缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 网络请求成功，更新缓存
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        // 网络请求失败，尝试从缓存获取
        return caches.match(event.request)
          .then(response => response || caches.match('/offline.html'));
      })
  );
});