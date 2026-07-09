import { IAiTool } from './tool.interface';
export declare class SendWhatsappMessageTool implements IAiTool {
    private sendMessageFn;
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            employeeId: {
                type: string;
                description: string;
            };
            message: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    constructor(sendMessageFn: (employeeId: string, message: string) => Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>);
    execute(args: {
        employeeId: string;
        message: string;
    }): Promise<any>;
}
//# sourceMappingURL=send-whatsapp-message.tool.d.ts.map