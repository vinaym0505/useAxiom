import { IAiMemory, IMemoryMessage } from './memory.interface';

export class InMemoryMemory implements IAiMemory {
  private shortTerm = new Map<string, IMemoryMessage[]>();
  private longTerm: Array<{ key: string; value: string; tags: string[] }> = [];

  async getShortTermContext(threadId: string): Promise<IMemoryMessage[]> {
    return this.shortTerm.get(threadId) || [];
  }

  async appendShortTermMessage(threadId: string, message: IMemoryMessage): Promise<void> {
    if (!this.shortTerm.has(threadId)) {
      this.shortTerm.set(threadId, []);
    }
    this.shortTerm.get(threadId)!.push(message);
  }

  async getLongTermContext(query: string, limit: number = 5): Promise<string[]> {
    const queryLower = query.toLowerCase();
    return this.longTerm
      .filter(
        (m) =>
          m.key.toLowerCase().includes(queryLower) ||
          m.value.toLowerCase().includes(queryLower) ||
          m.tags.some((t) => t.toLowerCase().includes(queryLower))
      )
      .slice(0, limit)
      .map((m) => `${m.key}: ${m.value}`);
  }

  async appendLongTermMemory(key: string, value: string, tags: string[] = []): Promise<void> {
    this.longTerm.push({ key, value, tags });
  }

  async clearContext(threadId: string): Promise<void> {
    this.shortTerm.delete(threadId);
  }
}
