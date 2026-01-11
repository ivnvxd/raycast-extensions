const models = [
  { title: "── OpenAI ──────────", value: "_openai_sep" },
  { title: "GPT-5.2 ($1.75/$14)", value: "openai:gpt-5.2" },
  { title: "GPT-5.1 ($1.25/$10)", value: "openai:gpt-5.1" },
  { title: "GPT-5 ($1.25/$10)", value: "openai:gpt-5" },
  { title: "GPT-5 mini ($0.25/$2)", value: "openai:gpt-5-mini" },
  { title: "GPT-5 nano ($0.05/$0.40)", value: "openai:gpt-5-nano" },
  { title: "GPT-5.2 Pro ($21/$168)", value: "openai:gpt-5.2-pro" },
  { title: "GPT-4.1 ($2/$8)", value: "openai:gpt-4.1" },
  { title: "GPT-4.1 mini ($0.40/$1.60)", value: "openai:gpt-4.1-mini" },
  { title: "GPT-4.1 nano ($0.10/$0.40)", value: "openai:gpt-4.1-nano" },
  { title: "── Claude ──────────", value: "_claude_sep" },
  { title: "Sonnet 4.5 ($3/$15)", value: "anthropic:claude-sonnet-4-5-20250929" },
  { title: "Haiku 4.5 ($1/$5)", value: "anthropic:claude-haiku-4-5-20251001" },
  { title: "Opus 4.5 ($5/$25)", value: "anthropic:claude-opus-4-5-20251101" },
  { title: "── Gemini ──────────", value: "_gemini_sep" },
  { title: "3 Pro Preview ($2/$12)", value: "google:gemini-3-pro-preview" },
  { title: "3 Flash Preview ($0.50/$3)", value: "google:gemini-3-flash-preview" },
  { title: "2.5 Pro ($1.25/$10)", value: "google:gemini-2.5-pro" },
  { title: "2.5 Flash ($0.30/$2.50)", value: "google:gemini-2.5-flash" },
  { title: "2.5 Flash-Lite ($0.10/$0.40)", value: "google:gemini-2.5-flash-lite" }
];

const commandModels = [
  { title: "Use Default", value: "global" },
  ...models
];

module.exports = {
  models,
  commandModels
};
