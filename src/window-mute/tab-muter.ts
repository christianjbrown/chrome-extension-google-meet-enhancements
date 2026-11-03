// Mutes and unmutes one tab, the way right-click "Mute site" would if it
// worked per tab. Muting a tab needs no permission, and an app or popup window
// is still a tab underneath, even though it has no tab strip to right-click.
import type { MuteChanged, MuteRequest, MuteState } from "./messages";

export interface Tabs {
  get(tabId: number): Promise<{ mutedInfo?: { muted: boolean } | undefined }>;
  update(tabId: number, properties: { muted: boolean }): Promise<unknown>;
  sendMessage(tabId: number, message: MuteChanged): Promise<unknown>;
}

export class TabMuter {
  constructor(private readonly tabs: Tabs) {}

  async answer(request: MuteRequest, tabId: number): Promise<MuteState> {
    const tab = await this.tabs.get(tabId);
    const muted = tab.mutedInfo?.muted ?? false;
    if (request.type === "mute-state") return { muted };
    await this.tabs.update(tabId, { muted: !muted });
    return { muted: !muted };
  }

  // A tab with no Meet page in it has nobody listening, which is fine.
  tell(tabId: number, muted: boolean): void {
    this.tabs
      .sendMessage(tabId, { type: "mute-changed", muted })
      .catch(() => undefined);
  }
}
