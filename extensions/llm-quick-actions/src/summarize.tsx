import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Summarize() {
  const prefs = getPreferenceValues<Preferences.Summarize>();

  return ResultView(prefs.prompt_summarize, prefs.provider_model_summarize, "Summarizing...");
}
