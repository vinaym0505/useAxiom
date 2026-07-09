"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskStatusTool = void 0;
class UpdateTaskStatusTool {
    updateTaskFn;
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
    constructor(updateTaskFn) {
        this.updateTaskFn = updateTaskFn;
    }
    async execute(args) {
        return this.updateTaskFn(args.taskId, args.status, args.reason);
    }
}
exports.UpdateTaskStatusTool = UpdateTaskStatusTool;
