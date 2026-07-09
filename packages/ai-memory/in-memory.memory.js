"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMemory = void 0;
class InMemoryMemory {
    shortTerm = new Map();
    longTerm = [];
    constructor() {
        this.longTerm.push({
            key: 'Build a monorepo',
            value: 'Milestone 1: Scaffold (Setup Monorepo, Configs). Milestone 2: API Integration (Scaffold NestJS API, Prisma db migrations).',
            tags: ['monorepo', 'scaffold', 'nestjs']
        }, {
            key: 'Create marketing campaign',
            value: 'Milestone 1: Copywriting (Draft Email Copy). Milestone 2: Deployment (Configure Audience, Load Graphics).',
            tags: ['marketing', 'campaign', 'launch']
        });
    }
    async getShortTermContext(threadId) {
        return this.shortTerm.get(threadId) || [];
    }
    async appendShortTermMessage(threadId, message) {
        if (!this.shortTerm.has(threadId)) {
            this.shortTerm.set(threadId, []);
        }
        this.shortTerm.get(threadId).push(message);
    }
    async getLongTermContext(query, limit = 5) {
        const queryLower = query.toLowerCase();
        return this.longTerm
            .filter((m) => m.key.toLowerCase().includes(queryLower) ||
            m.value.toLowerCase().includes(queryLower) ||
            m.tags.some((t) => t.toLowerCase().includes(queryLower)))
            .slice(0, limit)
            .map((m) => `${m.key}: ${m.value}`);
    }
    async appendLongTermMemory(key, value, tags = []) {
        this.longTerm.push({ key, value, tags });
    }
    async clearContext(threadId) {
        this.shortTerm.delete(threadId);
    }
}
exports.InMemoryMemory = InMemoryMemory;
