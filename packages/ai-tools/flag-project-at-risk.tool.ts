import { IAiTool } from './tool.interface';

export class FlagProjectAtRiskTool implements IAiTool {
  name = 'flag_project_at_risk';
  description = 'Flag a project as high risk on the manager dashboard and specify reasoning.';
  parameters = {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'The unique identifier of the project.' },
      riskScore: { type: 'number', description: 'The risk percentage score (0-100).' },
      reasoning: { type: 'string', description: 'The details or reasoning explaining the risk level.' }
    },
    required: ['projectId', 'riskScore', 'reasoning']
  };

  constructor(
    private flagProjectFn: (projectId: string, riskScore: number, reasoning: string) => Promise<{ success: boolean; error?: string }>
  ) {}

  async execute(args: { projectId: string; riskScore: number; reasoning: string }): Promise<any> {
    return this.flagProjectFn(args.projectId, args.riskScore, args.reasoning);
  }
}
