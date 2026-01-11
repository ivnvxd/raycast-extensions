# LLM Quick Actions

Performs one-shot actions (polish writing, summarize, translate, etc.) with multiple LLM providers using Raycast.

## Supported Providers

- **OpenAI** - GPT-5.x, GPT-4.1 series
- **Anthropic** - Claude Sonnet, Haiku, Opus 4.5
- **Google** - Gemini 2.5, 3.x series

## Features

- Real-time streaming responses
- Per-command model selection or use global default
- Token counting and cost estimation
- Keyboard shortcuts for quick regeneration

## Commands

| Command | Description |
|---------|-------------|
| Summarize | Summarize selected text |
| Rewrite | Rewrite with academic tone |
| Refine | Fix grammar and improve writing |
| Custom Action | Use custom prompt |
| Execute | Replace selection with LLM output |
| Preview | Preview LLM output without replacing |
| Transform | Replace with prompt entered at runtime |
| Transform Preview | Same as Transform but preview first |
| Translate | Translate to target language |
| Explain | Explain in simple terms |
| Reply | Draft a reply to a message |

## Setup

1. Get API keys from your preferred provider(s):
   - OpenAI: [platform.openai.com](https://platform.openai.com)
   - Anthropic: [console.anthropic.com](https://console.anthropic.com)
   - Google: [aistudio.google.com](https://aistudio.google.com)

2. Configure API key(s) in extension preferences

3. Select your default model

## Tips

- Use `Cmd + R` to regenerate results
- Use `Cmd + Shift + R` to retry with GPT-5.2
- Use `Cmd + Option + R` to retry with Claude Sonnet 4.5
- Use `Cmd + Option + Shift + R` to retry with Gemini 3 Pro
- Each command can override the default model in its preferences

## Development

```bash
# Generate package.json from template (after editing models)
npm run build-package

# Build extension
npm run build

# Development mode
npm run dev
```

Model definitions are centralized in `scripts/models.js`.