// The page's side of the conversation with the service worker, which is the
// only part of the extension allowed to mute a tab.
import { isMuteChanged, isMuteState } from "./message-guards";
import type { MuteRequest } from "./messages";
import { STATE_REQUEST } from "./state-request";
import type { Switch } from "./switch";
import { TOGGLE_REQUEST } from "./toggle-request";

export interface Runtime {
  sendMessage(message: MuteRequest): Promise<unknown>;
  onMessage: { addListener(listener: (message: unknown) => void): void };
}

const NO_ANSWER = "No answer about the tab";

// The tab's sound, once the service worker has given an answer that says it.
function mutedIn(answer: unknown): boolean {
  if (!isMuteState(answer)) throw new Error(NO_ANSWER);
  return answer.muted;
}

export class WorkerSwitch implements Switch {
  constructor(private readonly runtime: Runtime) {}

  state(): Promise<boolean> {
    return this.ask({ type: STATE_REQUEST });
  }

  toggle(): Promise<boolean> {
    return this.ask({ type: TOGGLE_REQUEST });
  }

  onChange(listener: (muted: boolean) => void): void {
    this.runtime.onMessage.addListener((message) => {
      if (isMuteChanged(message)) listener(message.muted);
    });
  }

  private async ask(request: MuteRequest): Promise<boolean> {
    return mutedIn(await this.runtime.sendMessage(request));
  }
}
