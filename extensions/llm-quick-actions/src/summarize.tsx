import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Summarize() {
  const prefs = getPreferenceValues<{
    prompt_summarize: string;
    provider_model_summarize?: string;
  }>();

  return ResultView(prefs.prompt_summarize, prefs.provider_model_summarize, "Summarizing...");
}
