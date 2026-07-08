import { ILlmProvider } from './provider.interface';
import { LLMConfig, LLMResponse, Message } from './types';

export class MockLlmProvider implements ILlmProvider {
  name = 'mock';

  async generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse> {
    return {
      content: '[Mock Text Output] Successful mock LLM response.',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }

  async generateStructuredResponse<T>(
    messages: Message[],
    schema: any,
    config?: LLMConfig
  ): Promise<T> {
    // 1. Detect if it's Assignment Agent calling (check for 'assignments' array schema)
    if (schema.properties?.assignments) {
      return {
        assignments: [
          {
            taskId: 'task-101',
            assigneeId: 'dev-2',
            rationale: 'Dev 2 has NestJS skills and lowest workload.'
          },
          {
            taskId: 'task-102',
            assigneeId: 'dev-3',
            rationale: 'Dev 3 is the Frontend Lead and has Tailwind skills.'
          }
        ]
      } as unknown as T;
    }

    // 2. Detect if it's Conversation Agent calling (check for 'intent' schema)
    if (schema.properties?.intent) {
      return {
        reply: 'Got it. I will mark that task as blocked and alert the manager.',
        intent: 'BLOCKED',
        confidenceScore: 0.95,
        extractedParameters: {
          blockReason: 'Blocked waiting on Figma designs.'
        }
      } as unknown as T;
    }

    // 3. Detect if it's Reporting Agent calling (check for 'riskScore' schema)
    if (schema.properties?.riskScore) {
      return {
        riskScore: 35,
        riskLevel: 'MEDIUM',
        reasoning:
          'Project has one blocked task on the critical path, but other milestones are on track.',
        suggestedActionItems: [
          'Review blocked Figma design task #12.',
          'Reassign API integration to Dev 2 to accelerate timeline.'
        ]
      } as unknown as T;
    }

    // 4. Default fallback: Planner Agent output
    return {
      milestones: [
        {
          name: 'Sprint 1: Base Platform & Identity',
          tasks: [
            {
              name: 'Setup Monorepo',
              description: 'Configure Turborepo, pnpm workspaces, and base tsconfig/eslint rules.',
              estimatedHours: 8,
              requiredSkills: ['DevOps', 'TypeScript', 'pnpm']
            },
            {
              name: 'Scaffold NestJS API',
              description: 'Initialize NestJS app-api modules and global exception filters.',
              estimatedHours: 6,
              requiredSkills: ['NestJS', 'TypeScript']
            }
          ]
        },
        {
          name: 'Sprint 2: Authentication & Multi-Tenancy',
          tasks: [
            {
              name: 'Database migrations',
              description: 'Define Prisma schemas for User, Organization, and Tenant limits.',
              estimatedHours: 4,
              requiredSkills: ['PostgreSQL', 'Prisma']
            }
          ]
        }
      ]
    } as unknown as T;
  }
}
