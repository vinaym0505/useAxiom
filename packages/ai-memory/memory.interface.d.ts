export interface IMemoryMessage {
    role: string;
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export interface IAiMemory {
    getShortTermContext(threadId: string): Promise<IMemoryMessage[]>;
    appendShortTermMessage(threadId: string, message: IMemoryMessage): Promise<void>;
    getLongTermContext(query: string, limit?: number): Promise<string[]>;
    appendLongTermMemory(key: string, value: string, tags?: string[]): Promise<void>;
    clearContext(threadId: string): Promise<void>;
}
//# sourceMappingURL=memory.interface.d.ts.map