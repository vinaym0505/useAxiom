import { IAiTool } from './tool.interface';
export declare class UpdateTaskStatusTool implements IAiTool {
    private updateTaskFn;
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            taskId: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            reason: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    constructor(updateTaskFn: (taskId: string, status: string, reason?: string) => Promise<{
        success: boolean;
        error?: string;
    }>);
    execute(args: {
        taskId: string;
        status: string;
        reason?: string;
    }): Promise<any>;
}
//# sourceMappingURL=update-task-status.tool.d.ts.map