import { getPreferenceValues, LaunchProps } from "@raycast/api";
import ResultView from "./common";

interface Arguments {
  prompt: string;
}

export default function TransformPreview(props: LaunchProps<{ arguments: Arguments }>) {
  const prefs = getPreferenceValues<{ provider_model_transform_preview?: string }>();
  const { prompt } = props.arguments;

  return ResultView(prompt, prefs.provider_model_transform_preview, "Transforming...");
}
