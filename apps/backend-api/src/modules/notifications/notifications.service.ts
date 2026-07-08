import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly whatsappService: WhatsappService) {}

  async triggerOrganizationSummary(orgId: string): Promise<void> {
    console.info(`[NotificationsService] Triggering summary broadcast for org: ${orgId}`);

    const mockEmployees = [
      { name: 'David', phone: '+1234567890' },
      { name: 'Sarah', phone: '+0987654321' },
    ];

    for (const employee of mockEmployees) {
      const summaryMsg = `Hello ${employee.name}, here is your daily task summary for today in useAxiom. Make sure to update your task status via WhatsApp!`;
      await this.whatsappService.enqueueOutboundMessage(employee.phone, summaryMsg);
    }
  }
}
