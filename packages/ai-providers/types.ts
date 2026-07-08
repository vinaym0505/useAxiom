export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  model?: string;
  responseFormat?: 'text' | 'json';
}

export interface LLMRequest {
  messages: Message[];
  config?: LLMConfig;
}

export interface LLMResponse {
  content: string;
  raw?: any;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
