import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiOrchestrator } from '@useaxiom/ai-core';
import { OpenAiProvider, MockLlmProvider } from '@useaxiom/ai-providers';
import { InMemoryMemory } from '@useaxiom/ai-memory';

@Injectable()
export class AiService implements OnModuleInit {
  private orchestrator: AiOrchestrator;

  onModuleInit() {
    const apiKey = process.env.OPENAI_API_KEY;
    const provider = apiKey ? new OpenAiProvider(apiKey) : new MockLlmProvider();
    const memory = new InMemoryMemory();

    this.orchestrator = new AiOrchestrator({ provider, memory });
    console.log(`[useAxiom] AI Service Initialized with "${provider.name}" provider.`);
  }

  getOrchestrator(): AiOrchestrator {
    return this.orchestrator;
  }
}
