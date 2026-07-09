import { IAiTool } from './tool.interface';

export class SendWhatsappMessageTool implements IAiTool {
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

  constructor(
    private sendMessageFn: (employeeId: string, message: string) => Promise<{ success: boolean; messageId?: string; error?: string }>
  ) {}

  async execute(args: { employeeId: string; message: string }): Promise<any> {
    return this.sendMessageFn(args.employeeId, args.message);
  }
}
