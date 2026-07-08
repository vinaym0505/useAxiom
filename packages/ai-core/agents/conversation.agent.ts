import { BaseAgent } from '../agent.base';

export interface ConversationInput {
  threadId: string;
  message: string;
}

export interface ConversationResponse {
  reply: string;
  intent: 'COMPLETED' | 'BLOCKED' | 'DELAYED' | 'QUESTION' | 'OTHER';
  confidenceScore: number;
  extractedParameters?: {
    blockReason?: string;
    delayReason?: string;
    estimatedCompletionDate?: string;
  };
}

const conversationJsonSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    intent: {
      type: 'string',
      enum: ['COMPLETED', 'BLOCKED', 'DELAYED', 'QUESTION', 'OTHER']
    },
    confidenceScore: { type: 'number' },
    extractedParameters: {
      type: 'object',
      properties: {
        blockReason: { type: 'string' },
        delayReason: { type: 'string' },
        estimatedCompletionDate: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  required: ['reply', 'intent', 'confidenceScore'],
  additionalProperties: false
};

export class ConversationAgent extends BaseAgent {
  async run(input: ConversationInput): Promise<ConversationResponse> {
    const history = await this.memory.getShortTermContext(input.threadId);
    const historyMessages = history.map((h) => ({
      role: h.role as 'user' | 'assistant' | 'system',
      content: h.content
    }));

    const messages = [
      {
        role: 'system' as const,
        content:
          this.systemPrompt ||
          'You are useAxiom\'s Conversation parsing agent. Read the WhatsApp message from the employee, determine their execution update intent, assign a confidence score, extract parameters if they are blocked or delayed, and write a helpful natural response.'
      },
      ...historyMessages,
      {
        role: 'user' as const,
        content: `Message: "${input.message}"`
      }
    ];

    const response = await this.provider.generateStructuredResponse<ConversationResponse>(
      messages,
      conversationJsonSchema,
      { temperature: 0.2, model: 'gpt-4o-mini' }
    );

    await this.memory.appendShortTermMessage(input.threadId, {
      role: 'user',
      content: input.message,
      timestamp: new Date()
    });

    await this.memory.appendShortTermMessage(input.threadId, {
      role: 'assistant',
      content: response.reply,
      timestamp: new Date(),
      metadata: {
        intent: response.intent,
        confidenceScore: response.confidenceScore,
        extractedParameters: response.extractedParameters
      }
    });

    return response;
  }
}
