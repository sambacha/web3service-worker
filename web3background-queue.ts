import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';
import { Queue } from 'workbox-background-sync';

const queue = new Queue('myQueueName');

self.addEventListener('fetch', (event) => {
  // Clone the request to ensure it's safe to read when
  // adding to the Queue.
  const promiseChain = fetch(event.request.clone()).catch((err) => {
    return queue.pushRequest({ request: event.request });
  });

  event.waitUntil(promiseChain);
});

const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  /\/api\/.*\/*.json/,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
