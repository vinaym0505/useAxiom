export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  model?: string;
  responseFormat?: 'text' | 'json';
  tools?: any[]; // Array of IAiTool objects
}

export interface LLMRequest {
  messages: Message[];
  config?: LLMConfig;
}

export interface LLMResponse {
  content: string;
  toolCalls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string; // JSON string
    };
  }>;
  raw?: any;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
