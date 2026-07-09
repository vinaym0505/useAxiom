import IORedis from 'ioredis';
import { setupNotificationsWorker } from './workers/notifications.worker';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

console.log('Background Workers starting up...');

// Initialize all queue workers
setupNotificationsWorker(redisConnection);

console.log('Background Workers successfully started and listening to queues.');
