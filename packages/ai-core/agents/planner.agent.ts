import { BaseAgent } from '../agent.base';
import { PLANNER_SYSTEM_PROMPT } from '../prompts';

export interface MilestoneTask {
  name: string;
  description: string;
  estimatedHours: number;
  requiredSkills: string[];
}

export interface MilestonePlan {
  name: string;
  tasks: MilestoneTask[];
}

export interface ProjectPlanResponse {
  milestones: MilestonePlan[];
}

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

export class PlannerAgent extends BaseAgent {
  async run(input: { 
    objective: string; 
    targetDeadline?: string;
    previousPlan?: ProjectPlanResponse;
    feedback?: string;
  }): Promise<ProjectPlanResponse> {
    const historicalContext = await this.memory.getLongTermContext(input.objective);
    const contextPrompt =
      historicalContext.length > 0
        ? `\n\nUse the following historical reference projects for similar scope and estimations:\n${historicalContext.join('\n')}`
        : '';

    const messages = [
      {
        role: 'system' as const,
        content:
          (this.systemPrompt || PLANNER_SYSTEM_PROMPT) +
          contextPrompt +
          (input.feedback && input.previousPlan
            ? `\n\nCRITICAL: Your previous plan was rejected by the Risk Assessor. You must revise it based on this feedback:\n"${input.feedback}"\n\nPrevious Plan:\n${JSON.stringify(input.previousPlan)}`
            : '')
      },
      {
        role: 'user' as const,
        content: `Objective: "${input.objective}"${
          input.targetDeadline ? `\nTarget Deadline: ${input.targetDeadline}` : ''
        }`
      }
    ];

    return this.provider.generateStructuredResponse<ProjectPlanResponse>(
      messages,
      plannerJsonSchema,
      {
        temperature: 0.1, // Keep it deterministic for planning
        model: 'gpt-4o-mini' // Standard cost-efficient reasoning model
      }
    );
  }
}
