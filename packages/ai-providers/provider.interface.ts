import { LLMConfig, LLMResponse, Message } from './types';

export interface ILlmProvider {
  name: string;
  generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse>;
  generateStructuredResponse<T>(messages: Message[], schema: any, config?: LLMConfig): Promise<T>;
}
