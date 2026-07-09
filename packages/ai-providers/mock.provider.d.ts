import { ILlmProvider } from './provider.interface';
import { LLMConfig, LLMResponse, Message } from './types';
export declare class MockLlmProvider implements ILlmProvider {
    name: string;
    generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse>;
    generateStructuredResponse<T>(messages: Message[], schema: any, config?: LLMConfig): Promise<T>;
    generateEmbedding(text: string): Promise<number[]>;
}
//# sourceMappingURL=mock.provider.d.ts.map