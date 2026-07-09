import OpenAI from 'openai';
import { ILlmProvider } from './provider.interface';
import { LLMConfig, LLMResponse, Message } from './types';

export class OpenAiProvider implements ILlmProvider {
  name = 'openai';
  private client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error(
        'OPENAI_API_KEY is missing. Please configure it in your environment variables to use OpenAI.'
      );
    }
    this.client = new OpenAI({ apiKey: key });
  }

  async generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse> {
    const tools = config?.tools?.map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }));

    const response = await this.client.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: messages as any,
      temperature: config?.temperature,
      max_tokens: config?.maxTokens,
      top_p: config?.topP,
      tools: tools && tools.length > 0 ? tools : undefined
    });

    const choice = response.choices[0]?.message;
    return {
      content: choice?.content || '',
      toolCalls: choice?.tool_calls?.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments
        }
      })),
      raw: response,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens
          }
        : undefined
    };
  }

  async generateStructuredResponse<T>(
    messages: Message[],
    schema: any,
    config?: LLMConfig
  ): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: messages as any,
      temperature: config?.temperature,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'structured_plan_response',
          strict: true,
          schema: schema
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('LLM returned an empty or invalid structured content completion.');
    }

    return JSON.parse(content) as T;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }
}
