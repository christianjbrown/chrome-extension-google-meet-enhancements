// Flips a tab's sound: mutes it if it was audible, unmutes it if it was muted.
import type { MuteRequestHandler } from "./mute-request-handler";

export interface TabSoundSetter {
  update(tabId: number, properties: { muted: boolean }): Promise<unknown>;
}

export class ToggleMute implements MuteRequestHandler {
  constructor(private readonly tabs: TabSoundSetter) {}

  async handle(tabId: number, muted: boolean): Promise<boolean> {
    await this.tabs.update(tabId, { muted: !muted });
    return !muted;
  }
}
