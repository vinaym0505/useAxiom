import { IAiTool } from './tool.interface';

export class UpdateTaskStatusTool implements IAiTool {
  name = 'update_task_status';
  description = 'Update the status of a specific task in the database.';
  parameters = {
    type: 'object',
    properties: {
      taskId: { type: 'string', description: 'The unique identifier of the task.' },
      status: {
        type: 'string',
        enum: ['PROPOSED', 'PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'],
        description: 'The new status to set.'
      },
      reason: { type: 'string', description: 'Optional explanation (e.g. blockers details).' }
    },
    required: ['taskId', 'status']
  };

  constructor(
    private updateTaskFn: (taskId: string, status: string, reason?: string) => Promise<{ success: boolean; error?: string }>
  ) {}

  async execute(args: { taskId: string; status: string; reason?: string }): Promise<any> {
    return this.updateTaskFn(args.taskId, args.status, args.reason);
  }
}
