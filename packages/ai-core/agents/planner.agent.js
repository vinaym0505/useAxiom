"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannerAgent = void 0;
const agent_base_1 = require("../agent.base");
const prompts_1 = require("../prompts");
// Strictly typed JSON schema for Planner Agent structured outputs including requiredSkills
const plannerJsonSchema = {
    type: 'object',
    properties: {
        milestones: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                description: { type: 'string' },
                                estimatedHours: { type: 'number' },
                                requiredSkills: {
                                    type: 'array',
                                    items: { type: 'string' }
                                }
                            },
                            required: ['name', 'description', 'estimatedHours', 'requiredSkills'],
                            additionalProperties: false
                        }
                    }
                },
                required: ['name', 'tasks'],
                additionalProperties: false
            }
        }
    },
    required: ['milestones'],
    additionalProperties: false
};
class PlannerAgent extends agent_base_1.BaseAgent {
    async run(input) {
        const historicalContext = await this.memory.getLongTermContext(input.objective);
        const contextPrompt = historicalContext.length > 0
            ? `\n\nUse the following historical reference projects for similar scope and estimations:\n${historicalContext.join('\n')}`
            : '';
        const messages = [
            {
                role: 'system',
                content: (this.systemPrompt || prompts_1.PLANNER_SYSTEM_PROMPT) +
                    contextPrompt +
                    (input.feedback && input.previousPlan
                        ? `\n\nCRITICAL: Your previous plan was rejected by the Risk Assessor. You must revise it based on this feedback:\n"${input.feedback}"\n\nPrevious Plan:\n${JSON.stringify(input.previousPlan)}`
                        : '')
            },
            {
                role: 'user',
                content: `Objective: "${input.objective}"${input.targetDeadline ? `\nTarget Deadline: ${input.targetDeadline}` : ''}`
            }
        ];
        return this.provider.generateStructuredResponse(messages, plannerJsonSchema, {
            temperature: 0.1, // Keep it deterministic for planning
            model: 'gpt-4o-mini' // Standard cost-efficient reasoning model
        });
    }
}
exports.PlannerAgent = PlannerAgent;
