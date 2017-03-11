importScripts('/cache-polyfill.js');
self.addEventListener('install', function(e) {
e.waitUntil(
caches.open('airhorner').then(function(cache) {
return cache.addAll([
'/'  
/*'/index.html',
'/css/amiiboTable.css',
'/css/buttonDesign.css',
'/css/divDesign.css',
'/css/textDesign.css',
'/css/modal.css',
'/js/test.js',*/
]);
})
);
});


/*self.addEventListener('fetch', function(event) {
console.log(event.request.url);
event.respondWith(
caches.match(event.request).then(function(response) {
return response || fetch(event.request);
})
);
});*/

// TODO: Fix this shit (aka the above code to run a 200 error request)

/*self.addEventListener('fetch', event => {
	// Responds with index.html
	if (event.request.url.endsWith('index.html')) {
		// Requests for one.js will result in the SW firing off a fetch() request,
		// which will be reflected in the DevTools Network panel.
		event.respondWith(fetch(event.request));
	// Signed In?
	//} else if (event.request.url.endsWith('indexsignedin')) {
    		// Requests for two.js will result in the SW constructing a new Response object,
		// so there won't be an additional network request in the DevTools Network panel.
		//event.respondWith(new Response('// no-op'));
	}
		// Error 200 custom page
		// Requests for anything else won't trigger event.respondWith(), so there won't be
		// any SW interaction reflected in the DevTools Network panel.
});*/

self.addEventListener('fetch', function(event) {
  console.log('Fetch event:', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found in cache:', response);
        return response;
      }

      console.log('No response found in cache. Fetch from network.');

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
              var cacheRequest = event.request.clone();
              console.log("Add to cache:" + cacheRequest);
              cache.put(cacheRequest, responseToCache);
            });

          return response;
        });
      
    })
  );
});
