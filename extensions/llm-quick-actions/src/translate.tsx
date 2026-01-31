import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Translate() {
  const prefs = getPreferenceValues<Preferences.Translate>();
  const prompt = `Translate the following text to ${prefs.target_language}:\n\n`;

  return ResultView(prompt, prefs.provider_model_translate, "Translating...");
}
