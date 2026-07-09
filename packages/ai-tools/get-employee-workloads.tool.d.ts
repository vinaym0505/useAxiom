import { IAiTool } from './tool.interface';
export declare class GetEmployeeWorkloadsTool implements IAiTool {
    private getWorkloadsFn;
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {};
        required: never[];
    };
    constructor(getWorkloadsFn: () => Promise<Array<{
        id: string;
        name: string;
        workload: number;
    }>>);
    execute(args: any): Promise<any>;
}
//# sourceMappingURL=get-employee-workloads.tool.d.ts.map