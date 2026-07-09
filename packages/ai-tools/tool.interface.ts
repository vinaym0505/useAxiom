export interface IAiTool {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema format
  execute(args: any): Promise<any>;
}
