import { BaseAgent } from '../agent.base';

export interface ConversationInput {
  threadId: string;
  message: string;
}

export class ConversationAgent extends BaseAgent {
  async run(input: ConversationInput): Promise<{
    reply: string;
    intent: 'update_task' | 'general_chat' | 'escalate';
    extractedData?: Record<string, any>;
  }> {
    // Skeleton conversation updates
    return {
      reply: "Hello, I am the useAxiom conversation assistant.",
      intent: 'general_chat'
    };
  }
}
