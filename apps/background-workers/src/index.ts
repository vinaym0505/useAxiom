import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import { createIncomingMessagesWorker } from './workers/incoming-messages.worker';
import { createOutgoingMessagesWorker } from './workers/outgoing-messages.worker';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisConnection = { host: redisHost, port: redisPort };

console.info(`[Background Workers] Initializing with Redis connection: ${redisHost}:${redisPort}`);

const inboundWorker = createIncomingMessagesWorker(redisConnection);
const outboundWorker = createOutgoingMessagesWorker(redisConnection);

process.on('SIGTERM', async () => {
  console.info('[Background Workers] Shutting down workers...');
  await inboundWorker.close();
  await outboundWorker.close();
  process.exit(0);
});
