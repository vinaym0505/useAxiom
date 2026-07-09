import { ILlmProvider } from '@useaxiom/ai-providers';
import { IAiMemory } from '@useaxiom/ai-memory';
import { PlannerAgent, ProjectPlanResponse } from './agents/planner.agent';
import { AssignmentAgent } from './agents/assignment.agent';
import { ConversationAgent } from './agents/conversation.agent';
import { ReportingAgent } from './agents/reporting.agent';
import { RiskAgent } from './agents/risk.agent';

export interface OrchestratorConfig {
  provider: ILlmProvider;
  memory: IAiMemory;
}

export class AiOrchestrator {
  private planner: PlannerAgent;
  private assigner: AssignmentAgent;
  private conversation: ConversationAgent;
  private reporting: ReportingAgent;
  private risk: RiskAgent;

  constructor(config: OrchestratorConfig) {
    this.planner = new PlannerAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: 'You are the Planner Agent.'
    });

    this.assigner = new AssignmentAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: 'You are the Assignment Agent.'
    });

    this.conversation = new ConversationAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: 'You are the Conversation Agent.'
    });

    this.reporting = new ReportingAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: 'You are the Reporting Agent.'
    });

    this.risk = new RiskAgent({
      provider: config.provider,
      memory: config.memory,
      systemPrompt: 'You are the Risk Assessment Agent.'
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

  getReporting() {
    return this.reporting;
  }

  getRisk() {
    return this.risk;
  }

  async generateDebatedPlan(objective: string): Promise<ProjectPlanResponse> {
    console.log('[Orchestrator] Generating initial plan...');
    let plan = await this.planner.run({ objective });
    
    let iterations = 0;
    while (iterations < 2) {
      console.log(`[Orchestrator] Running risk assessment (Iteration ${iterations + 1})...`);
      const riskAssessment = await this.risk.run({ plan });
      
      console.log(`[Orchestrator] Risk Assessment Result: Approved=${riskAssessment.approved}, Score=${riskAssessment.riskScore}`);
      
      if (riskAssessment.approved) {
        break; 
      }
      
      console.log(`[Orchestrator] Plan rejected. Feedback: ${riskAssessment.feedback}`);
      console.log('[Orchestrator] Revising plan...');
      
      plan = await this.planner.run({ 
        objective, 
        feedback: riskAssessment.feedback, 
        previousPlan: plan 
      });
      
      iterations++;
    }
    
    console.log('[Orchestrator] Final plan generated.');
    return plan;
  }
}
