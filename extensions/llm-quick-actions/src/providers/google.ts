import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, Message, StreamChunk } from "./types";

export class GoogleProvider implements LLMProvider {
  name = "Gemini";
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async *createStreamingCompletion(messages: Message[], model: string): AsyncGenerator<StreamChunk, void, unknown> {
    const genModel = this.genAI.getGenerativeModel({ model });

    // Convert messages to Gemini format
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    if (userMessages.length === 0) {
      throw new Error("At least one user message is required");
    }

    // Build the prompt combining system and user messages
    const history = userMessages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = userMessages[userMessages.length - 1];

    const chat = genModel.startChat({
      history: history as Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
      systemInstruction: systemMessage ? { role: "user", parts: [{ text: systemMessage.content }] } : undefined,
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield { content: text, done: false };
      }
    }

    yield { content: "", done: true };
  }

  async createCompletion(messages: Message[], model: string): Promise<string> {
    const genModel = this.genAI.getGenerativeModel({ model });

    // Convert messages to Gemini format
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    if (userMessages.length === 0) {
      throw new Error("At least one user message is required");
    }

    // Build the prompt combining system and user messages
    const history = userMessages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = userMessages[userMessages.length - 1];

    const chat = genModel.startChat({
      history: history as Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
      systemInstruction: systemMessage ? { role: "user", parts: [{ text: systemMessage.content }] } : undefined,
    });

    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text().trim();
  }
}
