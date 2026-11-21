// The page's side of the conversation with the service worker, which is the
// only part of the extension allowed to mute a tab.
import { isMuteChanged, MUTE_REQUEST } from "./messages";
import type { MuteRequest, MuteState } from "./messages";
import type { Switch } from "./switch";

export interface Runtime {
  sendMessage(message: MuteRequest): Promise<MuteState | undefined>;
  onMessage: { addListener(listener: (message: unknown) => void): void };
}

const NO_ANSWER = "No answer about the tab";

export class WorkerSwitch implements Switch {
  constructor(private readonly runtime: Runtime) {}

  state(): Promise<boolean> {
    return this.ask({ type: MUTE_REQUEST.state });
  }

  toggle(): Promise<boolean> {
    return this.ask({ type: MUTE_REQUEST.toggle });
  }

  onChange(listener: (muted: boolean) => void): void {
    this.runtime.onMessage.addListener((message) => {
      if (isMuteChanged(message)) listener(message.muted);
    });
  }

  private async ask(request: MuteRequest): Promise<boolean> {
    const answer = await this.runtime.sendMessage(request);
    if (answer === undefined) throw new Error(NO_ANSWER);
    return answer.muted;
  }
}
