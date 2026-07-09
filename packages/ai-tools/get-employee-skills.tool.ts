import { IAiTool } from './tool.interface';

export class GetEmployeeSkillsTool implements IAiTool {
  name = 'get_employee_skills';
  description = 'Retrieve the technical skills listed for all team members.';
  parameters = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(
    private getSkillsFn: () => Promise<Array<{ id: string; name: string; skills: string[] }>>
  ) {}

  async execute(args: any): Promise<any> {
    return this.getSkillsFn();
  }
}
