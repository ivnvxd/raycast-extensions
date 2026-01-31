import { getPreferenceValues } from "@raycast/api";
import ResultView from "./common";

export default function Refine() {
  const prefs = getPreferenceValues<Preferences.Refine>();

  return ResultView(prefs.prompt_refine, prefs.provider_model_refine, "Refining...");
}
