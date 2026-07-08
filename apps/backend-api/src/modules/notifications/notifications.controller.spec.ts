import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let mockNotificationsService: any;

  beforeEach(async () => {
    mockNotificationsService = {
      triggerOrganizationSummary: jest.fn().mockResolvedValue(undefined),
      sendBlockerAlert: jest.fn().mockResolvedValue(undefined),
      sendDeadlineReminder: jest.fn().mockResolvedValue(undefined),
      sendTaskAssignedAlert: jest.fn().mockResolvedValue(undefined),
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

  describe('blockerAlert', () => {
    it('should trigger blocker alert and return success status', async () => {
      const result = await controller.blockerAlert('task-1', '+12345', 'David', 'API is down');
      expect(mockNotificationsService.sendBlockerAlert).toHaveBeenCalledWith('task-1', '+12345', 'David', 'API is down');
      expect(result).toEqual({ status: 'blocker_alert_sent', taskId: 'task-1' });
    });
  });

  describe('deadlineReminder', () => {
    it('should trigger deadline reminder and return success status', async () => {
      const result = await controller.deadlineReminder('task-2', '+09876', 'Configure Audience', 2);
      expect(mockNotificationsService.sendDeadlineReminder).toHaveBeenCalledWith('task-2', '+09876', 'Configure Audience', 2);
      expect(result).toEqual({ status: 'deadline_reminder_sent', taskId: 'task-2' });
    });
  });

  describe('taskAssigned', () => {
    it('should trigger task assignment alert and return success status', async () => {
      const result = await controller.taskAssigned('task-3', '+11223', 'Load Graphics', '2026-07-10');
      expect(mockNotificationsService.sendTaskAssignedAlert).toHaveBeenCalledWith('task-3', '+11223', 'Load Graphics', '2026-07-10');
      expect(result).toEqual({ status: 'task_assignment_alert_sent', taskId: 'task-3' });
    });
  });
});
