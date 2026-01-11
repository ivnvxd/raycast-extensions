import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Custom() {
  const prefs = getPreferenceValues<{
    prompt_custom: string;
    provider_model_custom?: string;
  }>();

  return ResultView(prefs.prompt_custom, prefs.provider_model_custom, "Processing...");
}
