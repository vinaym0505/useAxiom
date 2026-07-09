import { BaseAgent } from '../agent.base';
import { REPORTING_SYSTEM_PROMPT } from '../prompts';

export interface ReportingInput {
  projectId: string;
  tasks: Array<{ id: string; name: string; status: string; estimatedHours: number }>;
}

export interface ProjectHealthReport {
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  suggestedActionItems: string[];
}

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

export class ReportingAgent extends BaseAgent {
  async run(input: ReportingInput): Promise<ProjectHealthReport> {
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompt || REPORTING_SYSTEM_PROMPT
      },
      {
        role: 'user' as const,
        content: `Project Tasks: ${JSON.stringify(input.tasks)}`
      }
    ];

    return this.provider.generateStructuredResponse<ProjectHealthReport>(
      messages,
      reportingJsonSchema,
      { temperature: 0.1, model: 'gpt-4o-mini' }
    );
  }
}
