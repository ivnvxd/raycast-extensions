import { Detail, ActionPanel, Action, showToast, Toast, Icon, getSelectedText } from "@raycast/api";
import { useState, useEffect, useRef } from "react";
import { getProviderAndModel } from "./providers";
import { ProviderType } from "./providers/types";
import { countToken, estimatePrice, formatPrice, getProviderDisplayName, sanitizeErrorMessage } from "./util";

const MAX_INPUT_LENGTH = 100000;

export default function ResultView(prompt: string, providerModelOverride: string | undefined, toastTitle: string) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputTokenCount, setInputTokenCount] = useState(0);
  const [outputTokenCount, setOutputTokenCount] = useState(0);
  const [providerType, setProviderType] = useState<ProviderType>("openai");
  const [model, setModel] = useState("");
  const [duration, setDuration] = useState(0);

  // Start fetching selected text IMMEDIATELY during first render (not in useEffect)
  const textPromiseRef = useRef<Promise<string> | null>(null);
  const textResultRef = useRef<{ text?: string; error?: boolean }>({});

  if (textPromiseRef.current === null) {
    textPromiseRef.current = getSelectedText()
      .then((text) => {
        textResultRef.current = { text };
        return text;
      })
      .catch(() => {
        textResultRef.current = { error: true };
        return "";
      });
  }

  // Refs for streaming updates and request cancellation
  const responseRef = useRef("");
  const requestIdRef = useRef(0);

  async function runCompletion(forceProviderModel?: string) {
    // Increment request ID to cancel any previous request
    const requestId = ++requestIdRef.current;

    const startTime = Date.now();

    // Wait for text fetch that was started during first render
    let text: string;
    try {
      text = await textPromiseRef.current!;
      if (textResultRef.current.error) {
        throw new Error("No text selected");
      }
    } catch {
      setLoading(false);
      setResponse(
        "⚠️ Raycast was unable to get the selected text. You may try copying the text to a text editor and try again."
      );
      return;
    }

    const toast = await showToast(Toast.Style.Animated, toastTitle);

    try {
      if (text.length > MAX_INPUT_LENGTH) {
        throw new Error(
          `Selected text is too long (${text.length.toLocaleString()} characters). Maximum is ${MAX_INPUT_LENGTH.toLocaleString()} characters.`
        );
      }

      const {
        provider,
        model: effectiveModel,
        providerType: effProviderType,
      } = getProviderAndModel(forceProviderModel || providerModelOverride);

      setProviderType(effProviderType);
      setModel(effectiveModel);
      setInputTokenCount(countToken(prompt + text));

      const messages = [
        { role: "system" as const, content: prompt },
        { role: "user" as const, content: text },
      ];

      responseRef.current = "";

      for await (const chunk of provider.createStreamingCompletion(messages, effectiveModel)) {
        // Check if this request is still current
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (chunk.content) {
          responseRef.current += chunk.content;
          setResponse(responseRef.current);
          setOutputTokenCount(countToken(responseRef.current));
        }

        if (chunk.done) {
          // Final update with complete response
          setResponse(responseRef.current);
          setOutputTokenCount(countToken(responseRef.current));
          setLoading(false);
          const elapsed = (Date.now() - startTime) / 1000;
          setDuration(elapsed);
          toast.style = Toast.Style.Success;
          toast.title = `Finished in ${elapsed.toFixed(1)} seconds`;
        }
      }
    } catch (error) {
      // Ignore errors from stale requests
      if (requestId !== requestIdRef.current) {
        return;
      }
      toast.style = Toast.Style.Failure;
      toast.title = "Error";
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setResponse(`## Error\n\n${sanitizeErrorMessage(errorMessage)}`);
    }
  }

  function retry(forceProviderModel?: string) {
    setLoading(true);
    setResponse("");
    responseRef.current = "";
    runCompletion(forceProviderModel);
  }

  useEffect(() => {
    runCompletion();

    return () => {
      requestIdRef.current++;
    };
  }, []);

  return (
    <Detail
      markdown={response}
      isLoading={loading}
      actions={
        !loading && (
          <ActionPanel title="Actions">
            <Action.CopyToClipboard title="Copy Results" content={response} />
            <Action.Paste title="Paste Results" content={response} />
            <Action
              title="Regenerate"
              onAction={() => retry()}
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              icon={Icon.Repeat}
            />
            <Action
              title="Retry with GPT-5.2"
              onAction={() => retry("openai:gpt-5.2")}
              shortcut={{ modifiers: ["cmd", "shift"], key: "r" }}
              icon={Icon.ArrowNe}
            />
            <Action
              title="Retry with Claude Sonnet 4.5"
              onAction={() => retry("anthropic:claude-sonnet-4-5-20250929")}
              shortcut={{ modifiers: ["cmd", "opt"], key: "r" }}
              icon={Icon.ArrowNe}
            />
            <Action
              title="Retry with Gemini 3 Pro"
              onAction={() => retry("google:gemini-3-pro-preview")}
              shortcut={{ modifiers: ["cmd", "opt", "shift"], key: "r" }}
              icon={Icon.ArrowNe}
            />
          </ActionPanel>
        )
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Provider" text={getProviderDisplayName(providerType)} />
          <Detail.Metadata.Label title="Model" text={model || "..."} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Input Tokens" text={inputTokenCount.toString()} />
          <Detail.Metadata.Label title="Output Tokens" text={outputTokenCount.toString()} />
          <Detail.Metadata.Label
            title="Est. Cost"
            text={formatPrice(estimatePrice(inputTokenCount, outputTokenCount, model))}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Duration" text={duration > 0 ? `${duration.toFixed(1)}s` : "..."} />
        </Detail.Metadata>
      }
    />
  );
}

/**
 * Execute a completion without showing UI (for no-view commands)
 */
export async function executeCompletion(
  selectedText: string,
  prompt: string,
  providerModelOverride?: string
): Promise<string> {
  if (selectedText.length > MAX_INPUT_LENGTH) {
    throw new Error(
      `Selected text is too long (${selectedText.length.toLocaleString()} characters). Maximum is ${MAX_INPUT_LENGTH.toLocaleString()} characters.`
    );
  }

  const { provider, model } = getProviderAndModel(providerModelOverride);

  await showToast({
    style: Toast.Style.Animated,
    title: "Processing...",
    message: `Using ${provider.name} (${model})`,
  });

  const messages = [
    { role: "system" as const, content: prompt },
    { role: "user" as const, content: selectedText },
  ];

  const result = await provider.createCompletion(messages, model);

  await showToast({
    style: Toast.Style.Success,
    title: "Done",
  });

  return result;
}
