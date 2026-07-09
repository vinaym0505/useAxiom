"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLlmProvider = getLlmProvider;
const openai_provider_1 = require("./openai.provider");
const gemini_provider_1 = require("./gemini.provider");
const mock_provider_1 = require("./mock.provider");
function getLlmProvider() {
    const providerName = process.env.LLM_PROVIDER?.toLowerCase();
    if (providerName === 'openai') {
        return new openai_provider_1.OpenAiProvider();
    }
    if (providerName === 'gemini') {
        return new gemini_provider_1.GeminiProvider();
    }
    console.warn('No LLM_PROVIDER specified, falling back to MockLlmProvider. Set LLM_PROVIDER=gemini or openai in env to use real integrations.');
    return new mock_provider_1.MockLlmProvider();
}
