import { IAiTool } from './tool.interface';

export class GetEmployeeWorkloadsTool implements IAiTool {
  name = 'get_employee_workloads';
  description = 'Retrieve the current active task workloads for all team members.';
  parameters = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(
    private getWorkloadsFn: () => Promise<Array<{ id: string; name: string; workload: number }>>
  ) {}

  async execute(args: any): Promise<any> {
    return this.getWorkloadsFn();
  }
}
