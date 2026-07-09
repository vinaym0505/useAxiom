"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmployeeWorkloadsTool = void 0;
class GetEmployeeWorkloadsTool {
    getWorkloadsFn;
    name = 'get_employee_workloads';
    description = 'Retrieve the current active task workloads for all team members.';
    parameters = {
        type: 'object',
        properties: {},
        required: []
    };
    constructor(getWorkloadsFn) {
        this.getWorkloadsFn = getWorkloadsFn;
    }
    async execute(args) {
        return this.getWorkloadsFn();
    }
}
exports.GetEmployeeWorkloadsTool = GetEmployeeWorkloadsTool;
