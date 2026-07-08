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

  async generateStructuredResponse<T>(messages: Message[], schema: any, config?: LLMConfig): Promise<T> {
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
