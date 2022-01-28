self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('sw').then(function (cache) {
			return cache.addAll(
				[
					'/index.html',
					'/apple-touch-icon-192.png',
					'/apple-touch-icon.png',
					'/favicon-32.ico',
					'/manifest.json'
				]
			);
		})
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);

		if (r) { return r; }
		
		const response = await fetch(e.request);
		const cache = await caches.open("sw");
		
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		
		return response;
	})());
});