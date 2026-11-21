// Tells a tab its sound changed, so the Meet page in it can redraw its button.
import { MUTE_CHANGED } from "./messages";
import type { MuteChanged } from "./messages";
import type { MuteTeller } from "./muter";

export interface TabMessages {
  sendMessage(tabId: number, message: MuteChanged): Promise<unknown>;
}

export class TabTeller implements MuteTeller {
  constructor(private readonly tabs: TabMessages) {}

  // A tab with no Meet page in it has nobody listening, which is fine.
  tell(tabId: number, muted: boolean): void {
    this.tabs
      .sendMessage(tabId, { type: MUTE_CHANGED, muted })
      .catch(() => undefined);
  }
}
