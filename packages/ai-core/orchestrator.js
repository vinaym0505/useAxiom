"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestrator = void 0;
const planner_agent_1 = require("./agents/planner.agent");
const assignment_agent_1 = require("./agents/assignment.agent");
const conversation_agent_1 = require("./agents/conversation.agent");
const reporting_agent_1 = require("./agents/reporting.agent");
const risk_agent_1 = require("./agents/risk.agent");
class AiOrchestrator {
    planner;
    assigner;
    conversation;
    reporting;
    risk;
    constructor(config) {
        this.planner = new planner_agent_1.PlannerAgent({
            provider: config.provider,
            memory: config.memory,
            systemPrompt: 'You are the Planner Agent.'
        });
        this.assigner = new assignment_agent_1.AssignmentAgent({
            provider: config.provider,
            memory: config.memory,
            systemPrompt: 'You are the Assignment Agent.'
        });
        this.conversation = new conversation_agent_1.ConversationAgent({
            provider: config.provider,
            memory: config.memory,
            systemPrompt: 'You are the Conversation Agent.'
        });
        this.reporting = new reporting_agent_1.ReportingAgent({
            provider: config.provider,
            memory: config.memory,
            systemPrompt: 'You are the Reporting Agent.'
        });
        this.risk = new risk_agent_1.RiskAgent({
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
    async generateDebatedPlan(objective) {
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
exports.AiOrchestrator = AiOrchestrator;
