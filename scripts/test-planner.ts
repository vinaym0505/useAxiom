import { MockLlmProvider } from '../packages/ai-providers';
import { PlannerAgent } from '../packages/ai-core';

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
  console.log('--- Starting Planner Agent Sprint 3 Test (Mock Provider Mode) ---');

  // Instantiate the dedicated MockLlmProvider for local verification
  const provider = new MockLlmProvider();
  const memory = new MockMemory() as any;

  const planner = new PlannerAgent({
    provider,
    memory,
    systemPrompt:
      'You are useAxiom\'s AI Project Planner. Break down the user\'s objective into milestone tasks.'
  });

  console.log('Sending objective: "Build a NextJS front-end SPA with authentication"');
  const result = await planner.run({
    objective: 'Build a NextJS front-end SPA with authentication'
  });

  console.log('\nGenerated Structured Output:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n--- Test Execution Complete ---');
}

runTest().catch(console.error);
