import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { plannerWorkerProcessor } from './workers/ai-planner.worker';
import { whatsappWorkerProcessor } from './workers/whatsapp.worker';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

console.log('Starting Background Workers...');

// @ts-ignore
const plannerWorker = new Worker('planner_jobs', plannerWorkerProcessor, { connection: redisConnection });
// @ts-ignore
const whatsappWorker = new Worker('whatsapp_jobs', whatsappWorkerProcessor, { connection: redisConnection });

plannerWorker.on('completed', job => console.log(`[Planner] Job ${job.id} completed.`));
whatsappWorker.on('completed', job => console.log(`[WhatsApp] Job ${job.id} completed.`));
