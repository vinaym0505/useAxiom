import { BaseAgent } from '../agent.base';
export interface MilestoneTask {
    name: string;
    description: string;
    estimatedHours: number;
    requiredSkills: string[];
}
export interface MilestonePlan {
    name: string;
    tasks: MilestoneTask[];
}
export interface ProjectPlanResponse {
    milestones: MilestonePlan[];
}
export declare class PlannerAgent extends BaseAgent {
    run(input: {
        objective: string;
        targetDeadline?: string;
        previousPlan?: ProjectPlanResponse;
        feedback?: string;
    }): Promise<ProjectPlanResponse>;
}
//# sourceMappingURL=planner.agent.d.ts.map