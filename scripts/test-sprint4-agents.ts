import { MockLlmProvider } from '../packages/ai-providers';
import { AiOrchestrator } from '../packages/ai-core';

class MockMemory {
  async getShortTermContext() {
    return [];
  }
  async appendShortTermMessage() {}
  async getLongTermContext() {
    return [];
  }
  async appendLongTermMemory() {}
  async clearContext() {}
}

async function runTest() {
  console.log('--- Starting Sprint 4 Agent Verification Tests ---');
  const provider = new MockLlmProvider();
  const memory = new MockMemory() as any;
  const orchestrator = new AiOrchestrator({ provider, memory });

  // 1. Test Assignment Agent
  console.log('\n1. Testing Assignment Agent...');
  const assignResult = await orchestrator.getAssigner().run({
    tasks: [
      { id: 'task-101', name: 'Scaffold APIs', requiredSkills: ['NestJS'] },
      { id: 'task-102', name: 'Dashboard UI', requiredSkills: ['Tailwind'] }
    ],
    team: [
      { id: 'dev-2', name: 'Bob', skills: ['NestJS'], workload: 2 },
      { id: 'dev-3', name: 'Alice', skills: ['Tailwind'], workload: 0 }
    ]
  });
  console.log('Assignments Output:\n', JSON.stringify(assignResult, null, 2));

  // 2. Test Conversation Agent
  console.log('\n2. Testing Conversation Agent (Parsing updates)...');
  const convResult = await orchestrator.getConversation().run({
    threadId: 'employee-whatsapp-thread',
    message: 'I am blocked waiting on Figma mockups'
  });
  console.log('Conversation Parse Output:\n', JSON.stringify(convResult, null, 2));

  // 3. Test Reporting Agent
  console.log('\n3. Testing Risk & Reporting Agent...');
  const reportResult = await orchestrator.getReporting().run({
    projectId: 'project-99',
    tasks: [
      { id: 'task-101', name: 'Scaffold APIs', status: 'COMPLETED', estimatedHours: 8 },
      { id: 'task-102', name: 'Dashboard UI', status: 'BLOCKED', estimatedHours: 12 }
    ]
  });
  console.log('Project Risk Report Output:\n', JSON.stringify(reportResult, null, 2));

  console.log('\n--- Sprint 4 Verification Tests Complete ---');
}

runTest().catch(console.error);
