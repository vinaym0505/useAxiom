import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-summary')
  async sendSummary(@Body('organizationId') organizationId: string) {
    console.info(`[NotificationsController] Received send-summary trigger for organizationId: ${organizationId}`);
    const orgId = organizationId || 'default-org';
    await this.notificationsService.triggerOrganizationSummary(orgId);
    return { status: 'summary_triggered', organizationId: orgId };
  }
}
