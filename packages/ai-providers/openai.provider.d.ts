import { ILlmProvider } from './provider.interface';
import { LLMConfig, LLMResponse, Message } from './types';
export declare class OpenAiProvider implements ILlmProvider {
    name: string;
    private client;
    constructor(apiKey?: string);
    generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse>;
    generateStructuredResponse<T>(messages: Message[], schema: any, config?: LLMConfig): Promise<T>;
    generateEmbedding(text: string): Promise<number[]>;
}
//# sourceMappingURL=openai.provider.d.ts.map