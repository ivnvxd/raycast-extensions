import { getPreferenceValues, getSelectedText, Clipboard, showHUD } from "@raycast/api";
import { executeCompletion } from "./common";
import { sanitizeErrorMessage } from "./util";

interface Preferences {
  provider_model_execute?: string;
}

export default async function Execute() {
  let selectedText: string;
  try {
    selectedText = await getSelectedText();
  } catch {
    await showHUD("No text selected. Please select some text and try again.");
    return;
  }

  const prefs = getPreferenceValues<Preferences>();
  const prompt = "You are a helpful assistant. Respond to the user's input. Only output the result, no explanations:";

  try {
    const result = await executeCompletion(selectedText, prompt, prefs.provider_model_execute);

    await Clipboard.paste(result);
    await showHUD("Result pasted");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await showHUD(`Error: ${sanitizeErrorMessage(message)}`);
  }
}
