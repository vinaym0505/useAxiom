import { GoogleGenAI } from '@google/genai';
import { ILlmProvider } from './provider.interface';
import { LLMConfig, LLMResponse, Message } from './types';

export class GeminiProvider implements ILlmProvider {
  name = 'gemini';
  private client: GoogleGenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        'GEMINI_API_KEY is missing. Please configure it in your environment variables to use Gemini.'
      );
    }
    this.client = new GoogleGenAI({ apiKey: key });
  }

  async generateResponse(messages: Message[], config?: LLMConfig): Promise<LLMResponse> {
    let systemInstruction = '';
    const contents: any[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'tool') {
        contents.push({
          role: 'tool',
          parts: [
            {
              functionResponse: {
                name: msg.name || '',
                response: { output: msg.content }
              }
            }
          ]
        });
      }
    }

    const geminiTools: any[] = [];
    if (config?.tools && config.tools.length > 0) {
      geminiTools.push({
        functionDeclarations: config.tools.map((t) => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }))
      });
    }

    const response = await this.client.models.generateContent({
      model: config?.model || 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: config?.temperature,
        maxOutputTokens: config?.maxTokens,
        topP: config?.topP,
        tools: geminiTools.length > 0 ? geminiTools : undefined
      }
    });

    const text = response.text || '';
    const functionCalls = response.functionCalls;

    return {
      content: text,
      toolCalls: functionCalls?.map((fc, index) => ({
        id: `gemini-call-${fc.name || ''}-${index}`,
        type: 'function',
        function: {
          name: fc.name || '',
          arguments: JSON.stringify(fc.args || {})
        }
      })),
      raw: response
    };
  }

  async generateStructuredResponse<T>(
    messages: Message[],
    schema: any,
    config?: LLMConfig
  ): Promise<T> {
    let systemInstruction = '';
    const contents: any[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      }
    }

    const response = await this.client.models.generateContent({
      model: config?.model || 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: config?.temperature,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned an empty or invalid structured content completion.');
    }

    return JSON.parse(text) as T;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.models.embedContent({
      model: 'text-embedding-004',
      contents: [text],
    });
    return response.embeddings?.[0]?.values || [];
  }
}
