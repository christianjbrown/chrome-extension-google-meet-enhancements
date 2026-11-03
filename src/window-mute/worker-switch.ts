// The page's side of the conversation with the service worker, which is the
// only part of the extension allowed to mute a tab.
import { isMuteChanged } from "./messages";
import type { MuteRequest, MuteState } from "./messages";

export interface Switch {
  state(): Promise<boolean>;
  toggle(): Promise<boolean>;
  onChange(listener: (muted: boolean) => void): void;
}

export interface Runtime {
  sendMessage(message: MuteRequest): Promise<MuteState | undefined>;
  onMessage: { addListener(listener: (message: unknown) => void): void };
}

export class WorkerSwitch implements Switch {
  constructor(private readonly runtime: Runtime) {}

  state(): Promise<boolean> {
    return this.ask({ type: "mute-state" });
  }

  toggle(): Promise<boolean> {
    return this.ask({ type: "toggle-mute" });
  }

  onChange(listener: (muted: boolean) => void): void {
    this.runtime.onMessage.addListener((message) => {
      if (isMuteChanged(message)) listener(message.muted);
    });
  }

  private async ask(request: MuteRequest): Promise<boolean> {
    const answer = await this.runtime.sendMessage(request);
    if (answer === undefined) throw new Error("No answer about the tab");
    return answer.muted;
  }
}
