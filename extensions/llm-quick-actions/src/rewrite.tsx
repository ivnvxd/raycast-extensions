import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Rewrite() {
  const prefs = getPreferenceValues<{
    prompt_rewrite: string;
    provider_model_rewrite?: string;
  }>();

  return ResultView(prefs.prompt_rewrite, prefs.provider_model_rewrite, "Rewriting...");
}
