import { ILlmProvider } from '@useaxiom/ai-providers';
import { IAiMemory } from '@useaxiom/ai-memory';

export interface AgentConfig {
  provider: ILlmProvider;
  memory: IAiMemory;
  systemPrompt: string;
}

export abstract class BaseAgent {
  protected provider: ILlmProvider;
  protected memory: IAiMemory;
  protected systemPrompt: string;

  constructor(config: AgentConfig) {
    this.provider = config.provider;
    this.memory = config.memory;
    this.systemPrompt = config.systemPrompt;
  }

  abstract run(input: any): Promise<any>;
}
