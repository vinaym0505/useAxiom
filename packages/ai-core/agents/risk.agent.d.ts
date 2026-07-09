import { BaseAgent } from '../agent.base';
export interface RiskAssessmentResponse {
    approved: boolean;
    feedback: string;
    riskScore: number;
}
export declare class RiskAgent extends BaseAgent {
    run(input: {
        plan: any;
    }): Promise<RiskAssessmentResponse>;
}
//# sourceMappingURL=risk.agent.d.ts.map