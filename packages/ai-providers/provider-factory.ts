import { ILlmProvider } from './provider.interface';
import { OpenAiProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { MockLlmProvider } from './mock.provider';

export function getLlmProvider(): ILlmProvider {
  const providerName = process.env.LLM_PROVIDER?.toLowerCase();

  if (providerName === 'openai') {
    return new OpenAiProvider();
  }

  if (providerName === 'gemini') {
    return new GeminiProvider();
  }

  console.warn('No LLM_PROVIDER specified, falling back to MockLlmProvider. Set LLM_PROVIDER=gemini or openai in env to use real integrations.');
  return new MockLlmProvider();
}
