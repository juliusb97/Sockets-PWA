self.addEventListener('install', function(event) {
	event.waitUntil(
	  caches.open(cacheName).then(function(cache) {
		return cache.addAll(
		  [
			'/index.html',
			'/apple-touch-icon-192.png',
			'/apple-touch-icon.png'
		  ]
		);
	  })
	);
  });