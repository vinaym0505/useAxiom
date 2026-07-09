import { IAiTool } from './tool.interface';
export declare class FlagProjectAtRiskTool implements IAiTool {
    private flagProjectFn;
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            projectId: {
                type: string;
                description: string;
            };
            riskScore: {
                type: string;
                description: string;
            };
            reasoning: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    constructor(flagProjectFn: (projectId: string, riskScore: number, reasoning: string) => Promise<{
        success: boolean;
        error?: string;
    }>);
    execute(args: {
        projectId: string;
        riskScore: number;
        reasoning: string;
    }): Promise<any>;
}
//# sourceMappingURL=flag-project-at-risk.tool.d.ts.map