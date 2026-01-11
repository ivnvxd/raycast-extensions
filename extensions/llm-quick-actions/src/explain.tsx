import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Explain() {
  const prefs = getPreferenceValues<{ provider_model_explain?: string }>();
  const prompt = "Explain the following in simple, easy-to-understand terms:\n\n";

  return ResultView(prompt, prefs.provider_model_explain, "Explaining...");
}
