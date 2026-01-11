import { encode } from "@nem035/gpt-3-encoder";
import { ProviderType } from "./providers/types";

/**
 * Sanitize error messages to remove potential API keys
 */
export function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/sk-[a-zA-Z0-9-_]{20,}/g, "sk-***HIDDEN***")
    .replace(/sk-proj-[a-zA-Z0-9-_]{20,}/g, "sk-proj-***HIDDEN***")
    .replace(/sk-ant-[a-zA-Z0-9-_]{20,}/g, "sk-ant-***HIDDEN***")
    .replace(/AIza[a-zA-Z0-9-_]{35}/g, "AIza***HIDDEN***");
}

/**
 * Count tokens in content (approximation, primarily accurate for OpenAI)
 */
export function countToken(content: string): number {
  return encode(content).length;
}

/**
 * Pricing per 1M tokens (input/output) for various models
 */
const PRICING: Record<string, { input: number; output: number }> = {
  // OpenAI models (per 1M tokens)
  "gpt-5.2": { input: 1.75, output: 14 },
  "gpt-5.1": { input: 1.25, output: 10 },
  "gpt-5": { input: 1.25, output: 10 },
  "gpt-5-mini": { input: 0.25, output: 2 },
  "gpt-5-nano": { input: 0.05, output: 0.4 },
  "gpt-5.2-pro": { input: 21, output: 168 },
  "gpt-4.1": { input: 2, output: 8 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },

  // Anthropic models (per 1M tokens)
  "claude-sonnet-4-5-20250929": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 1, output: 5 },
  "claude-opus-4-5-20251101": { input: 5, output: 25 },

  // Google models (per 1M tokens)
  "gemini-3-pro-preview": { input: 2, output: 12 },
  "gemini-3-flash-preview": { input: 0.5, output: 3 },
  "gemini-2.5-pro": { input: 1.25, output: 10 },
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
  "gemini-2.5-flash-lite": { input: 0.1, output: 0.4 },
};

/**
 * Estimate price for a completion
 */
export function estimatePrice(inputTokens: number, outputTokens: number, model: string): number {
  const pricing = PRICING[model];
  if (!pricing) {
    return 0; // Unknown model, can't estimate
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return inputCost + outputCost;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price < 0.0001) {
    return "< $0.0001";
  }
  return `$${price.toFixed(4)}`;
}

/**
 * Get display name for provider
 */
export function getProviderDisplayName(providerType: ProviderType): string {
  switch (providerType) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Claude";
    case "google":
      return "Gemini";
  }
}
