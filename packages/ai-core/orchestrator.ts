import { ILlmProvider } from '@useaxiom/ai-providers';
import { IAiMemory } from '@useaxiom/ai-memory';
import { PlannerAgent } from './agents/planner.agent';
import { AssignmentAgent } from './agents/assignment.agent';
import { ConversationAgent } from './agents/conversation.agent';

export interface OrchestratorConfig {
  provider: ILlmProvider;
  memory: IAiMemory;
}

export class AiOrchestrator {
  private planner: PlannerAgent;
  private assigner: AssignmentAgent;
  private conversation: ConversationAgent;

  constructor(config: OrchestratorConfig) {
    this.planner = new PlannerAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: "You are the Planner Agent."
    });

    this.assigner = new AssignmentAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: "You are the Assignment Agent."
    });

    this.conversation = new ConversationAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: "You are the Conversation Agent."
    });
  }

  getPlanner() {
    return this.planner;
  }

  getAssigner() {
    return this.assigner;
  }

  getConversation() {
    return this.conversation;
  }
}
