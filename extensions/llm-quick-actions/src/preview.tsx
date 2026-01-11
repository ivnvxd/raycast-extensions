import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Preview() {
  const prefs = getPreferenceValues<{ provider_model_preview?: string }>();
  const prompt = "You are a helpful assistant. Respond to the user's input:";

  return ResultView(prompt, prefs.provider_model_preview, "Processing...");
}
