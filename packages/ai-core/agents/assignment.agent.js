"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentAgent = void 0;
const agent_base_1 = require("../agent.base");
const prompts_1 = require("../prompts");
const assignmentJsonSchema = {
    type: 'object',
    properties: {
        assignments: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    taskId: { type: 'string' },
                    assigneeId: { type: 'string' },
                    rationale: { type: 'string' }
                },
                required: ['taskId', 'assigneeId', 'rationale'],
                additionalProperties: false
            }
        }
    },
    required: ['assignments'],
    additionalProperties: false
};
class AssignmentAgent extends agent_base_1.BaseAgent {
    async run(input) {
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt || prompts_1.ASSIGNMENT_SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: `Assign the following tasks to the team:\nTasks: ${JSON.stringify(input.tasks)}\nTeam: ${JSON.stringify(input.team)}`
            }
        ];
        return this.provider.generateStructuredResponse(messages, assignmentJsonSchema, { temperature: 0.1, model: 'gpt-4o-mini' });
    }
}
exports.AssignmentAgent = AssignmentAgent;
