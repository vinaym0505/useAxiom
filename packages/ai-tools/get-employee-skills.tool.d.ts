import { IAiTool } from './tool.interface';
export declare class GetEmployeeSkillsTool implements IAiTool {
    private getSkillsFn;
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {};
        required: never[];
    };
    constructor(getSkillsFn: () => Promise<Array<{
        id: string;
        name: string;
        skills: string[];
    }>>);
    execute(args: any): Promise<any>;
}
//# sourceMappingURL=get-employee-skills.tool.d.ts.map