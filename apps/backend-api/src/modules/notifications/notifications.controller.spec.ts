import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let mockNotificationsService: any;

  beforeEach(async () => {
    mockNotificationsService = {
      triggerOrganizationSummary: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  describe('sendSummary', () => {
    it('should trigger summary and return success status', async () => {
      const result = await controller.sendSummary('org-123');
      expect(mockNotificationsService.triggerOrganizationSummary).toHaveBeenCalledWith('org-123');
      expect(result).toEqual({ status: 'summary_triggered', organizationId: 'org-123' });
    });

    it('should fall back to default organization id if not provided', async () => {
      const result = await controller.sendSummary(undefined as any);
      expect(mockNotificationsService.triggerOrganizationSummary).toHaveBeenCalledWith('default-org');
      expect(result).toEqual({ status: 'summary_triggered', organizationId: 'default-org' });
    });
  });
});
