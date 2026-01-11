import { getPreferenceValues, Clipboard, showHUD, LaunchProps } from "@raycast/api";
import { executeCompletion } from "./common";
import { sanitizeErrorMessage } from "./util";

interface Preferences {
  provider_model_transform?: string;
}

interface Arguments {
  prompt: string;
}

export default async function Transform(props: LaunchProps<{ arguments: Arguments }>) {
  const { prompt } = props.arguments;
  const prefs = getPreferenceValues<Preferences>();

  const systemPrompt = `${prompt}\n\nOnly output the result, no explanations:`;

  try {
    const result = await executeCompletion(systemPrompt, prefs.provider_model_transform);

    await Clipboard.paste(result);
    await showHUD("Result pasted");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await showHUD(`Error: ${sanitizeErrorMessage(message)}`);
  }
}
