import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { WhatsappModule } from '../modules/whatsapp/whatsapp.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    WhatsappModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
