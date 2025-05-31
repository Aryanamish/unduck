self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v1';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v1'
    // `Cache` instance for later use.
    return cache.addAll([
      
    ]);
  }));
});