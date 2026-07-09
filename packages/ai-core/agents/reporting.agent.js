"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingAgent = void 0;
const agent_base_1 = require("../agent.base");
const prompts_1 = require("../prompts");
const reportingJsonSchema = {
    type: 'object',
    properties: {
        riskScore: { type: 'number' },
        riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
        reasoning: { type: 'string' },
        suggestedActionItems: {
            type: 'array',
            items: { type: 'string' }
        }
    },
    required: ['riskScore', 'riskLevel', 'reasoning', 'suggestedActionItems'],
    additionalProperties: false
};
class ReportingAgent extends agent_base_1.BaseAgent {
    async run(input) {
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt || prompts_1.REPORTING_SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: `Project Tasks: ${JSON.stringify(input.tasks)}`
            }
        ];
        return this.provider.generateStructuredResponse(messages, reportingJsonSchema, { temperature: 0.1, model: 'gpt-4o-mini' });
    }
}
exports.ReportingAgent = ReportingAgent;
