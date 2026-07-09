import { IAiMemory, IMemoryMessage } from './memory.interface';
import { ILlmProvider } from '@useaxiom/ai-providers';
export declare class RagMemory implements IAiMemory {
    private provider;
    constructor(provider: ILlmProvider);
    getShortTermContext(threadId: string): Promise<IMemoryMessage[]>;
    appendShortTermMessage(threadId: string, message: IMemoryMessage): Promise<void>;
    getLongTermContext(query: string, limit?: number): Promise<string[]>;
    appendLongTermMemory(key: string, value: string, tags?: string[]): Promise<void>;
    clearContext(threadId: string): Promise<void>;
}
//# sourceMappingURL=rag.memory.d.ts.map