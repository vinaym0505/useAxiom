import { Worker, Job } from 'bullmq';

export function createOutgoingMessagesWorker(redisConnection: { host: string; port: number }) {
  console.info('[OutgoingWorker] Starting outgoing messages worker...');

  const worker = new Worker(
    'outgoing_messages',
    async (job: Job) => {
      console.info(`[OutgoingWorker] Processing job ${job.id} of type ${job.name}`);
      console.info('[OutgoingWorker] Outbound Message Details:', JSON.stringify(job.data, null, 2));

      console.info(`[OutgoingWorker] Outbound message successfully "sent" to: ${job.data.to}`);
      return { success: true, sentAt: new Date().toISOString() };
    },
    {
      connection: redisConnection,
    }
  );

  worker.on('completed', (job) => {
    console.info(`[OutgoingWorker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[OutgoingWorker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}
