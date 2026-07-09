"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmployeeSkillsTool = void 0;
class GetEmployeeSkillsTool {
    getSkillsFn;
    name = 'get_employee_skills';
    description = 'Retrieve the technical skills listed for all team members.';
    parameters = {
        type: 'object',
        properties: {},
        required: []
    };
    constructor(getSkillsFn) {
        this.getSkillsFn = getSkillsFn;
    }
    async execute(args) {
        return this.getSkillsFn();
    }
}
exports.GetEmployeeSkillsTool = GetEmployeeSkillsTool;
