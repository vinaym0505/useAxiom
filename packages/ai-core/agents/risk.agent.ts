import { BaseAgent } from '../agent.base';

export interface RiskAssessmentResponse {
  approved: boolean;
  feedback: string;
  riskScore: number;
}

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

export class RiskAgent extends BaseAgent {
  async run(input: { plan: any }): Promise<RiskAssessmentResponse> {
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompt || 'You are the Risk Assessment Agent. Review the provided project plan. If the timeline is unrealistic, tasks are missing, or there are major risks, reject it (approved: false) and provide detailed feedback for the Planner to revise. If it looks solid, approve it.'
      },
      {
        role: 'user' as const,
        content: `Review this plan: ${JSON.stringify(input.plan)}`
      }
    ];

    return this.provider.generateStructuredResponse<RiskAssessmentResponse>(
      messages,
      riskJsonSchema,
      {
        temperature: 0.2,
        model: 'gpt-4o-mini'
      }
    );
  }
}
