import { BaseAgent } from '../agent.base';

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
        content:
          this.systemPrompt ||
          'You are useAxiom\'s Risk & Reporting Agent. Analyze the project execution state, compute a risk percentage score (0-100), determine the risk level, explain your logic, and list actionable suggestions for the manager dashboard.'
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
