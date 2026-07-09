import { IAiMemory, IMemoryMessage } from './memory.interface';
export declare class InMemoryMemory implements IAiMemory {
    private shortTerm;
    private longTerm;
    constructor();
    getShortTermContext(threadId: string): Promise<IMemoryMessage[]>;
    appendShortTermMessage(threadId: string, message: IMemoryMessage): Promise<void>;
    getLongTermContext(query: string, limit?: number): Promise<string[]>;
    appendLongTermMemory(key: string, value: string, tags?: string[]): Promise<void>;
    clearContext(threadId: string): Promise<void>;
}
//# sourceMappingURL=in-memory.memory.d.ts.map