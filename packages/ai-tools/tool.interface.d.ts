export interface IAiTool {
    name: string;
    description: string;
    parameters: Record<string, any>;
    execute(args: any): Promise<any>;
}
//# sourceMappingURL=tool.interface.d.ts.map