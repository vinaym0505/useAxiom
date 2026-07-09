"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendWhatsappMessageTool = void 0;
class SendWhatsappMessageTool {
    sendMessageFn;
    name = 'send_whatsapp_message';
    description = 'Send a WhatsApp notification message to a team member.';
    parameters = {
        type: 'object',
        properties: {
            employeeId: { type: 'string', description: 'The unique identifier of the employee.' },
            message: { type: 'string', description: 'The text content of the message.' }
        },
        required: ['employeeId', 'message']
    };
    constructor(sendMessageFn) {
        this.sendMessageFn = sendMessageFn;
    }
    async execute(args) {
        return this.sendMessageFn(args.employeeId, args.message);
    }
}
exports.SendWhatsappMessageTool = SendWhatsappMessageTool;
