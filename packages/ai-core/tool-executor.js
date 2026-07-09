"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgentWithTools = runAgentWithTools;
async function runAgentWithTools(messages, config, llmConfig, maxTurns = 5) {
    const { provider, tools } = config;
    const toolRegistry = new Map();
    for (const t of tools) {
        toolRegistry.set(t.name, t);
    }
    let turn = 0;
    while (turn < maxTurns) {
        turn++;
        console.info(`[useAxiom] Tool Execution Loop - Turn ${turn}/${maxTurns}`);
        // Call the LLM with current messages and tools list
        const response = await provider.generateResponse(messages, {
            ...llmConfig,
            tools: tools
        });
        // Check if the LLM requested tool execution
        if (!response.toolCalls || response.toolCalls.length === 0) {
            // No tool calls requested: this is the final response
            return response.content;
        }
        // LLM returned tool calls: push the assistant message (with tool calls) to history
        messages.push({
            role: 'assistant',
            content: response.content || '',
            tool_calls: response.toolCalls.map((tc) => ({
                id: tc.id,
                type: 'function',
                function: {
                    name: tc.function.name,
                    arguments: tc.function.arguments
                }
            }))
        });
        // Execute each requested tool call and push results to history
        for (const tc of response.toolCalls) {
            const tool = toolRegistry.get(tc.function.name);
            let resultString;
            if (!tool) {
                resultString = JSON.stringify({ error: `Tool "${tc.function.name}" not found.` });
                console.warn(`[useAxiom] Requested tool "${tc.function.name}" is not registered.`);
            }
            else {
                try {
                    const args = JSON.parse(tc.function.arguments);
                    console.info(`[useAxiom] Executing tool "${tool.name}" with args:`, args);
                    const result = await tool.execute(args);
                    resultString = typeof result === 'string' ? result : JSON.stringify(result);
                    console.info(`[useAxiom] Tool "${tool.name}" returned:`, resultString);
                }
                catch (err) {
                    resultString = JSON.stringify({ error: err.message || 'Error executing tool.' });
                    console.error(`[useAxiom] Error executing tool "${tool.name}":`, err);
                }
            }
            messages.push({
                role: 'tool',
                name: tc.function.name,
                content: resultString,
                tool_call_id: tc.id
            });
        }
    }
    throw new Error(`Exceeded maximum tool execution turns (${maxTurns}) without a final answer.`);
}
