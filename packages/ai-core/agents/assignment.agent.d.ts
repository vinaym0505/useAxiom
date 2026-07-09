import { BaseAgent } from '../agent.base';
export interface AssignerInput {
    tasks: Array<{
        id: string;
        name: string;
        requiredSkills?: string[];
    }>;
    team: Array<{
        id: string;
        name: string;
        skills: string[];
        workload: number;
    }>;
}
export interface TaskAssignment {
    taskId: string;
    assigneeId: string;
    rationale: string;
}
export interface AssignmentResponse {
    assignments: TaskAssignment[];
}
export declare class AssignmentAgent extends BaseAgent {
    run(input: AssignerInput): Promise<AssignmentResponse>;
}
//# sourceMappingURL=assignment.agent.d.ts.map