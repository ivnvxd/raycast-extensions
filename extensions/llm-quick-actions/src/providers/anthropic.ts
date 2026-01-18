import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, Message, StreamChunk } from "./types";

export class AnthropicProvider implements LLMProvider {
  name = "Claude";
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async *createStreamingCompletion(messages: Message[], model: string): AsyncGenerator<StreamChunk, void, unknown> {
    // Anthropic uses system message separately
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const stream = await this.client.messages.stream({
      model,
      max_tokens: 4096,
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { content: event.delta.text, done: false };
      } else if (event.type === "message_stop") {
        yield { content: "", done: true };
      }
    }
  }

  async createCompletion(messages: Message[], model: string): Promise<string> {
    // Anthropic uses system message separately
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const response = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const textBlock = response.content.find((block: { type: string }) => block.type === "text");
    const content = textBlock?.type === "text" ? (textBlock as { type: "text"; text: string }).text.trim() : "";
    if (!content) {
      if (response.stop_reason === "end_turn" && response.content.length === 0) {
        throw new Error("Claude returned an empty response");
      }
      throw new Error(`Claude returned no text content (stop_reason: ${response.stop_reason || "unknown"})`);
    }
    return content;
  }
}
