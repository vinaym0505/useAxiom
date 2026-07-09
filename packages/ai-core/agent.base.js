"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
class BaseAgent {
    provider;
    memory;
    systemPrompt;
    constructor(config) {
        this.provider = config.provider;
        this.memory = config.memory;
        this.systemPrompt = config.systemPrompt;
    }
}
exports.BaseAgent = BaseAgent;
