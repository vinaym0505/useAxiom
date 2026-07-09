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
export declare class ConversationAgent extends BaseAgent {
    run(input: ConversationInput): Promise<ConversationResponse>;
}
//# sourceMappingURL=conversation.agent.d.ts.map