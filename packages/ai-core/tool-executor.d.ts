import { ILlmProvider, Message, LLMConfig } from '@useaxiom/ai-providers';
import { IAiTool } from '@useaxiom/ai-tools';
export interface ToolExecutorConfig {
    provider: ILlmProvider;
    tools: IAiTool[];
}
export declare function runAgentWithTools(messages: Message[], config: ToolExecutorConfig, llmConfig?: LLMConfig, maxTurns?: number): Promise<string>;
//# sourceMappingURL=tool-executor.d.ts.map