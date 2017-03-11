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


self.addEventListener('fetch', function(event) {
console.log(event.request.url);
event.respondWith(
caches.match(event.request).then(function(response) {
return response || fetch(event.request);
})
);
});

// TODO: Fix this shit (aka the above code to run a 200 error request)