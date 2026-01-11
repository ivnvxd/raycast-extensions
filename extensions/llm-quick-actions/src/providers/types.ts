export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface LLMProvider {
  name: string;

  /**
   * Create a streaming completion
   * @returns AsyncGenerator that yields content chunks
   */
  createStreamingCompletion(messages: Message[], model: string): AsyncGenerator<StreamChunk, void, unknown>;

  /**
   * Create a non-streaming completion
   * @returns The complete response text
   */
  createCompletion(messages: Message[], model: string): Promise<string>;
}

export type ProviderType = "openai" | "anthropic" | "google";

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  model: string;
}
