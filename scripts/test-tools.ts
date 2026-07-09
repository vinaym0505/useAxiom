import { MockLlmProvider } from '../packages/ai-providers';
import { runAgentWithTools } from '../packages/ai-core';
import {
  GetEmployeeWorkloadsTool,
  GetEmployeeSkillsTool,
  UpdateTaskStatusTool,
  SendWhatsappMessageTool,
  FlagProjectAtRiskTool
} from '../packages/ai-tools';

async function runToolsVerification() {
  console.log('--- Starting Tool-Calling Layer Verification Tests ---');

  const provider = new MockLlmProvider();

  // Instantiate tools with mock handlers
  const workloadsTool = new GetEmployeeWorkloadsTool(async () => {
    console.log('[Mock Callback] Fetching workloads from DB...');
    return [
      { id: 'dev-2', name: 'Bob', workload: 2 },
      { id: 'dev-3', name: 'Alice', workload: 0 }
    ];
  });

  const skillsTool = new GetEmployeeSkillsTool(async () => {
    console.log('[Mock Callback] Fetching team skills from DB...');
    return [
      { id: 'dev-2', name: 'Bob', skills: ['NestJS'] },
      { id: 'dev-3', name: 'Alice', skills: ['Tailwind', 'Next.js'] }
    ];
  });

  const updateStatusTool = new UpdateTaskStatusTool(async (taskId, status, reason) => {
    console.log(`[Mock Callback] Updating task "${taskId}" status to "${status}" (reason: ${reason || 'none'})...`);
    return { success: true };
  });

  const sendMsgTool = new SendWhatsappMessageTool(async (employeeId, message) => {
    console.log(`[Mock Callback] Sending WhatsApp notification to employee "${employeeId}": "${message}"...`);
    return { success: true, messageId: 'wa-msg-1234' };
  });

  const flagProjectTool = new FlagProjectAtRiskTool(async (projectId, riskScore, reasoning) => {
    console.log(`[Mock Callback] Flagging project "${projectId}" with risk: ${riskScore}% (reasoning: "${reasoning}")...`);
    return { success: true };
  });

  const tools = [workloadsTool, skillsTool, updateStatusTool, sendMsgTool, flagProjectTool];

  // 1. Verify get_employee_workloads ReAct execution
  console.log('\n--- 1. Testing Workload Retrieval Tool Execution ---');
  const messages1 = [{ role: 'user' as const, content: 'What are the current employee workloads?' }];
  const result1 = await runAgentWithTools(messages1, { provider, tools });
  console.log('Response content:\n', result1);
  console.log('Dialogue history log:\n', JSON.stringify(messages1, null, 2));

  // 2. Verify update_task_status ReAct execution
  console.log('\n--- 2. Testing Update Task Status Tool Execution ---');
  const messages2 = [{ role: 'user' as const, content: 'Mark task task-102 as completed' }];
  const result2 = await runAgentWithTools(messages2, { provider, tools });
  console.log('Response content:\n', result2);
  console.log('Dialogue history log:\n', JSON.stringify(messages2, null, 2));

  // 3. Verify flag_project_at_risk ReAct execution
  console.log('\n--- 3. Testing Flag Project at Risk Tool Execution ---');
  const messages3 = [{ role: 'user' as const, content: 'Flag project project-99 as high risk' }];
  const result3 = await runAgentWithTools(messages3, { provider, tools });
  console.log('Response content:\n', result3);
  console.log('Dialogue history log:\n', JSON.stringify(messages3, null, 2));

  console.log('\n--- Tool-Calling Layer Verification Tests Complete ---');
}

runToolsVerification().catch(console.error);
