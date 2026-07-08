import { Worker, Job } from 'bullmq';

export function createIncomingMessagesWorker(redisConnection: { host: string; port: number }) {
  console.info('[IncomingWorker] Starting incoming messages worker...');
  
  const worker = new Worker(
    'incoming_messages',
    async (job: Job) => {
      console.info(`[IncomingWorker] Processing job ${job.id} of type ${job.name}`);
      console.info('[IncomingWorker] Payload:', JSON.stringify(job.data, null, 2));

      return { success: true, processedAt: new Date().toISOString() };
    },
    {
      connection: redisConnection,
    }
  );

  worker.on('completed', (job) => {
    console.info(`[IncomingWorker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[IncomingWorker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}
