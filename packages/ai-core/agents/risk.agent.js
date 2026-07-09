"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAgent = void 0;
const agent_base_1 = require("../agent.base");
const riskJsonSchema = {
    type: 'object',
    properties: {
        approved: { type: 'boolean' },
        feedback: { type: 'string' },
        riskScore: { type: 'number' }
    },
    required: ['approved', 'feedback', 'riskScore'],
    additionalProperties: false
};
class RiskAgent extends agent_base_1.BaseAgent {
    async run(input) {
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt || 'You are the Risk Assessment Agent. Review the provided project plan. If the timeline is unrealistic, tasks are missing, or there are major risks, reject it (approved: false) and provide detailed feedback for the Planner to revise. If it looks solid, approve it.'
            },
            {
                role: 'user',
                content: `Review this plan: ${JSON.stringify(input.plan)}`
            }
        ];
        return this.provider.generateStructuredResponse(messages, riskJsonSchema, {
            temperature: 0.2,
            model: 'gpt-4o-mini'
        });
    }
}
exports.RiskAgent = RiskAgent;
