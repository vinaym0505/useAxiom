import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { Queue } from 'bullmq';

const whatsappQueue = new Queue('whatsapp_jobs', { connection: { host: process.env.REDIS_HOST || 'localhost', port: 6379 } });

@Controller('webhooks')
export class WebhooksController {
  @Post('whatsapp')
  @HttpCode(HttpStatus.OK)
  async handleWhatsApp(@Body() payload: any, @Headers('x-hub-signature-256') signature: string) {
    // In production, verify the signature with Meta's app secret
    // Push the payload to Redis
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      await whatsappQueue.add('process_message', {
        message: message.text?.body,
        from: message.from,
        // tenantId would be looked up based on the WhatsApp Business Account ID or phone number
        tenantId: 'system'
      });
    }

    return { status: 'success' };
  }
}
