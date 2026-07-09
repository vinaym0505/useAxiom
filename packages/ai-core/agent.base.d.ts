import { ILlmProvider } from '@useaxiom/ai-providers';
import { IAiMemory } from '@useaxiom/ai-memory';
export interface AgentConfig {
    provider: ILlmProvider;
    memory: IAiMemory;
    systemPrompt: string;
}
export declare abstract class BaseAgent {
    protected provider: ILlmProvider;
    protected memory: IAiMemory;
    protected systemPrompt: string;
    constructor(config: AgentConfig);
    abstract run(input: any): Promise<any>;
}
//# sourceMappingURL=agent.base.d.ts.map