import { getPreferenceValues, getSelectedText, Clipboard, showHUD, LaunchProps } from "@raycast/api";
import { executeCompletion } from "./common";
import { sanitizeErrorMessage } from "./util";

interface Arguments {
  prompt: string;
}

export default async function Transform(props: LaunchProps<{ arguments: Arguments }>) {
  let selectedText: string;
  try {
    selectedText = await getSelectedText();
  } catch {
    await showHUD("No text selected. Please select some text and try again.");
    return;
  }

  const { prompt } = props.arguments;
  const prefs = getPreferenceValues<Preferences.Transform>();
  const systemPrompt = `${prompt}\n\nOnly output the result, no explanations:`;

  try {
    const result = await executeCompletion(selectedText, systemPrompt, prefs.provider_model_transform);

    await Clipboard.paste(result);
    await showHUD("Result pasted");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await showHUD(`Error: ${sanitizeErrorMessage(message)}`);
  }
}
