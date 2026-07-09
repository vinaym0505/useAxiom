"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagMemory = void 0;
const database_1 = __importDefault(require("@useaxiom/database"));
class RagMemory {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async getShortTermContext(threadId) {
        const messages = await database_1.default.shortTermMemory.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
        return messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.createdAt,
        }));
    }
    async appendShortTermMessage(threadId, message) {
        await database_1.default.shortTermMemory.create({
            data: {
                threadId,
                role: message.role,
                content: message.content,
                createdAt: message.timestamp,
            },
        });
    }
    async getLongTermContext(query, limit = 5) {
        const embedding = await this.provider.generateEmbedding(query);
        const embeddingStr = `[${embedding.join(',')}]`;
        const results = await database_1.default.$queryRaw `
      SELECT value
      FROM "LongTermMemory"
      ORDER BY embedding <=> ${embeddingStr}::vector
      LIMIT ${limit}
    `;
        return results.map((r) => r.value);
    }
    async appendLongTermMemory(key, value, tags) {
        const embedding = await this.provider.generateEmbedding(value);
        const embeddingStr = `[${embedding.join(',')}]`;
        await database_1.default.$executeRaw `
      INSERT INTO "LongTermMemory" (id, key, value, tags, embedding, "createdAt")
      VALUES (
        gen_random_uuid(), 
        ${key}, 
        ${value}, 
        ARRAY[${(tags || []).join(',')}]::text[], 
        ${embeddingStr}::vector, 
        NOW()
      )
    `;
    }
    async clearContext(threadId) {
        await database_1.default.shortTermMemory.deleteMany({
            where: { threadId },
        });
    }
}
exports.RagMemory = RagMemory;
