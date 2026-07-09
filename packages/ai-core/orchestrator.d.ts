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
export declare class AiOrchestrator {
    private planner;
    private assigner;
    private conversation;
    private reporting;
    private risk;
    constructor(config: OrchestratorConfig);
    getPlanner(): PlannerAgent;
    getAssigner(): AssignmentAgent;
    getConversation(): ConversationAgent;
    getReporting(): ReportingAgent;
    getRisk(): RiskAgent;
    generateDebatedPlan(objective: string): Promise<ProjectPlanResponse>;
}
//# sourceMappingURL=orchestrator.d.ts.map