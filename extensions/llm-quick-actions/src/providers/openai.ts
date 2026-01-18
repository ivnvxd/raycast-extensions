import OpenAI from "openai";
import { LLMProvider, Message, StreamChunk } from "./types";

export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async *createStreamingCompletion(messages: Message[], model: string): AsyncGenerator<StreamChunk, void, unknown> {
    const stream = await this.client.chat.completions.create({
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      const done = chunk.choices[0]?.finish_reason != null;

      if (content || done) {
        yield { content, done };
      }
    }
  }

  async createCompletion(messages: Message[], model: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      const finishReason = response.choices[0]?.finish_reason;
      if (finishReason === "content_filter") {
        throw new Error("Content was filtered by OpenAI. The request may violate usage policies.");
      }
      throw new Error(`OpenAI returned no content (finish_reason: ${finishReason || "unknown"})`);
    }
    return content;
  }
}
