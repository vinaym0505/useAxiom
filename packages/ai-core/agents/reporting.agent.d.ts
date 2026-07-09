import { BaseAgent } from '../agent.base';
export interface ReportingInput {
    projectId: string;
    tasks: Array<{
        id: string;
        name: string;
        status: string;
        estimatedHours: number;
    }>;
}
export interface ProjectHealthReport {
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasoning: string;
    suggestedActionItems: string[];
}
export declare class ReportingAgent extends BaseAgent {
    run(input: ReportingInput): Promise<ProjectHealthReport>;
}
//# sourceMappingURL=reporting.agent.d.ts.map