"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const genai_1 = require("@google/genai");
class GeminiProvider {
    name = 'gemini';
    client;
    constructor(apiKey) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY is missing. Please configure it in your environment variables to use Gemini.');
        }
        this.client = new genai_1.GoogleGenAI({ apiKey: key });
    }
    async generateResponse(messages, config) {
        let systemInstruction = '';
        const contents = [];
        for (const msg of messages) {
            if (msg.role === 'system') {
                systemInstruction = msg.content;
            }
            else if (msg.role === 'user') {
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.content }]
                });
            }
            else if (msg.role === 'assistant') {
                contents.push({
                    role: 'model',
                    parts: [{ text: msg.content }]
                });
            }
            else if (msg.role === 'tool') {
                contents.push({
                    role: 'tool',
                    parts: [
                        {
                            functionResponse: {
                                name: msg.name || '',
                                response: { output: msg.content }
                            }
                        }
                    ]
                });
            }
        }
        const geminiTools = [];
        if (config?.tools && config.tools.length > 0) {
            geminiTools.push({
                functionDeclarations: config.tools.map((t) => ({
                    name: t.name,
                    description: t.description,
                    parameters: t.parameters
                }))
            });
        }
        const response = await this.client.models.generateContent({
            model: config?.model || 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction || undefined,
                temperature: config?.temperature,
                maxOutputTokens: config?.maxTokens,
                topP: config?.topP,
                tools: geminiTools.length > 0 ? geminiTools : undefined
            }
        });
        const text = response.text || '';
        const functionCalls = response.functionCalls;
        return {
            content: text,
            toolCalls: functionCalls?.map((fc, index) => ({
                id: `gemini-call-${fc.name || ''}-${index}`,
                type: 'function',
                function: {
                    name: fc.name || '',
                    arguments: JSON.stringify(fc.args || {})
                }
            })),
            raw: response
        };
    }
    async generateStructuredResponse(messages, schema, config) {
        let systemInstruction = '';
        const contents = [];
        for (const msg of messages) {
            if (msg.role === 'system') {
                systemInstruction = msg.content;
            }
            else if (msg.role === 'user') {
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.content }]
                });
            }
            else if (msg.role === 'assistant') {
                contents.push({
                    role: 'model',
                    parts: [{ text: msg.content }]
                });
            }
        }
        const response = await this.client.models.generateContent({
            model: config?.model || 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction || undefined,
                temperature: config?.temperature,
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error('Gemini returned an empty or invalid structured content completion.');
        }
        return JSON.parse(text);
    }
    async generateEmbedding(text) {
        const response = await this.client.models.embedContent({
            model: 'text-embedding-004',
            contents: [text],
        });
        return response.embeddings?.[0]?.values || [];
    }
}
exports.GeminiProvider = GeminiProvider;
