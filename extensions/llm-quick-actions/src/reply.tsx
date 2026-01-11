import { getPreferenceValues, LaunchProps } from "@raycast/api";
import ResultView from "./common";

interface Arguments {
  instructions: string;
}

export default function Reply(props: LaunchProps<{ arguments: Arguments }>) {
  const prefs = getPreferenceValues<{
    reply_tone: string;
    provider_model_reply?: string;
  }>();
  const { instructions } = props.arguments;

  const prompt = instructions
    ? `Draft a ${prefs.reply_tone} reply to the following message. Instructions: ${instructions}\n\n`
    : `Draft a ${prefs.reply_tone} reply to the following message:\n\n`;

  return ResultView(prompt, prefs.provider_model_reply, "Drafting reply...");
}
