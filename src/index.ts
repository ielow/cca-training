import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import Anthropic from "@anthropic-ai/sdk";

const rl = readline.createInterface({ input, output });

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const messages: Anthropic.MessageParam[] = [];

const calculator = (mathExpresion: string): string => {
  console.log("calculando")
  console.log(mathExpresion)
  return JSON.stringify({
    result: Function(`"use strict"; return (${mathExpresion})`)(),
  });
};

const webSearchStub = (search:string):string => {

  console.log("buscando...")
  console.log(search)
return JSON.stringify({
  result: `
      This is waht we faound in your search term: ${search}
      Content and more content
      - Nice 
      - Good
  `
})
}
const web_search_stub_schema:Anthropic.Tool =
  {
    "name": "web_search_stub",
    "description": "Searches the web for information based on a search term",
    "input_schema": {
      "type": "object",
      "properties": {
        "search": {
          "type": "string",
          "description": "The search term or query to search for on the web"
        }
      },
      "required": ["search"]
    }
  } 

const calculator_schema:Anthropic.Tool = {
  "name": "calculator",
  "description": "Evaluates a mathematical expression and returns the result",
  "input_schema": {
    "type": "object",
    "properties": {
      "mathExpresion": {
        "type": "string",
        "description": "The mathematical expression to evaluate (e.g. '2 + 2', '10 * (3 + 4)')"
      }
    },
    "required": ["mathExpresion"]
  }
}


const runTool = (toolName: string, toolInput: Record<string, string>): string => {
  if (toolName === "calculator") {
    return calculator(toolInput.mathExpresion);
  } else if (toolName === "web_search_stub") {
    return webSearchStub(toolInput.search);
  } else {
    throw new Error(`Unknown tool: ${toolName}`);
  }
};

const chat = async (userInput: string): Promise<string> => {
  messages.push({ role: "user", content: userInput });

  
  while (true) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: `You are a chatbot that relies exclusively on tools for information.
- For any question about facts, current events, or topics: call web_search_stub.
- For math: call calculator.
- After receiving a tool result, your response MUST be based ONLY on the exact content returned by the tool. Do not add, modify, or supplement with your own knowledge.`,
      tool_choice: { type: "any" },
      tools: [calculator_schema, web_search_stub_schema],
      messages,
    });
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      const text = response.content.find((b) => b.type === "text");
      return text?.text ?? "";
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
        .map((toolUse) => ({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: runTool(toolUse.name, toolUse.input as Record<string, string>),
        }));
      messages.push({ role: "user", content: toolResults });
    }
  }

  
};

export async function dialog(): Promise<void> {
  try {
    const userInput = await rl.question("You: ");

    if (["exit", "quit"].includes(userInput.trim().toLowerCase())) {
      console.log("Good bye!!");
      rl.close();
      return;
    }

    const reply = await chat(userInput);
    console.log(`Assistant: ${reply}\n`);

    await dialog();
  } catch (err) {
    console.error(`Error in dialog: ${err}`);
  }
}

dialog();
