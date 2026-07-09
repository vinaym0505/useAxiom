"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationAgent = void 0;
const agent_base_1 = require("../agent.base");
const prompts_1 = require("../prompts");
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
class ConversationAgent extends agent_base_1.BaseAgent {
    async run(input) {
        const history = await this.memory.getShortTermContext(input.threadId);
        const historyMessages = history.map((h) => ({
            role: h.role,
            content: h.content
        }));
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt || prompts_1.CONVERSATION_SYSTEM_PROMPT
            },
            ...historyMessages,
            {
                role: 'user',
                content: `Message: "${input.message}"`
            }
        ];
        const response = await this.provider.generateStructuredResponse(messages, conversationJsonSchema, { temperature: 0.2, model: 'gpt-4o-mini' });
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
exports.ConversationAgent = ConversationAgent;
