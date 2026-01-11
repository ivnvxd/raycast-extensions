import { getPreferenceValues } from "@raycast/api";
import { LLMProvider, ProviderType } from "./types";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GoogleProvider } from "./google";

interface Preferences {
  openai_apikey?: string;
  anthropic_apikey?: string;
  google_apikey?: string;
  default_model: string; // format: "provider:model"
}

/**
 * Create a provider instance based on type
 */
export function createProvider(providerType: ProviderType): LLMProvider {
  const prefs = getPreferenceValues<Preferences>();

  switch (providerType) {
    case "openai": {
      if (!prefs.openai_apikey) {
        throw new Error("OpenAI API key is required. Please set it in the extension preferences.");
      }
      return new OpenAIProvider(prefs.openai_apikey);
    }
    case "anthropic": {
      if (!prefs.anthropic_apikey) {
        throw new Error("Anthropic API key is required. Please set it in the extension preferences.");
      }
      return new AnthropicProvider(prefs.anthropic_apikey);
    }
    case "google": {
      if (!prefs.google_apikey) {
        throw new Error("Google AI API key is required. Please set it in the extension preferences.");
      }
      return new GoogleProvider(prefs.google_apikey);
    }
  }
}

/**
 * Get provider and model for a command, handling combined override
 * @param providerModelOverride - Combined format: "provider:model" or "global" for default
 */
export function getProviderAndModel(providerModelOverride?: string): {
  provider: LLMProvider;
  model: string;
  providerType: ProviderType;
} {
  const prefs = getPreferenceValues<Preferences>();

  // Use override if provided and valid, otherwise use global default
  const effectiveSelection =
    providerModelOverride && providerModelOverride !== "global" && !providerModelOverride.startsWith("_")
      ? providerModelOverride
      : prefs.default_model;

  const parts = effectiveSelection.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid model selection format");
  }

  const providerType = parts[0] as ProviderType;
  const model = parts[1];

  const provider = createProvider(providerType);
  return { provider, model, providerType };
}
