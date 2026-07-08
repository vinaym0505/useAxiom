import { BaseAgent } from '../agent.base';

export interface AssignerInput {
  tasks: Array<{ id: string; name: string; requiredSkills?: string[] }>;
  team: Array<{ id: string; name: string; skills: string[]; workload: number }>;
}

export interface TaskAssignment {
  taskId: string;
  assigneeId: string;
  rationale: string;
}

export interface AssignmentResponse {
  assignments: TaskAssignment[];
}

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

export class AssignmentAgent extends BaseAgent {
  async run(input: AssignerInput): Promise<AssignmentResponse> {
    const messages = [
      {
        role: 'system' as const,
        content:
          this.systemPrompt ||
          'You are useAxiom\'s Task Assignment Agent. Match tasks to team members based on their workload, capacity, and matching technical skills. Provide a clear logical rationale for every match.'
      },
      {
        role: 'user' as const,
        content: `Assign the following tasks to the team:\nTasks: ${JSON.stringify(
          input.tasks
        )}\nTeam: ${JSON.stringify(input.team)}`
      }
    ];

    return this.provider.generateStructuredResponse<AssignmentResponse>(
      messages,
      assignmentJsonSchema,
      { temperature: 0.1, model: 'gpt-4o-mini' }
    );
  }
}
