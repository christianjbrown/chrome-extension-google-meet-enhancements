// Mutes and unmutes one tab, the way right-click "Mute site" would if it
// worked per tab. Muting a tab needs no permission, and an app or popup window
// is still a tab underneath, even though it has no tab strip to right-click.
import type { MuteRequest, MuteState } from "./messages";
import type { MuteRequestHandlers } from "./mute-request-handler";
import type { MuteAnswerer } from "./muter";

export interface TabSound {
  get(tabId: number): Promise<{ mutedInfo?: { muted: boolean } | undefined }>;
}

export class TabMuter implements MuteAnswerer {
  // A new kind of request is a new handler, listed in worker.ts.
  constructor(
    private readonly tabs: TabSound,
    private readonly handlers: MuteRequestHandlers,
  ) {}

  async answer(request: MuteRequest, tabId: number): Promise<MuteState> {
    const tab = await this.tabs.get(tabId);
    // A tab Chrome says nothing about is not muted.
    const muted = tab.mutedInfo?.muted === true;
    return { muted: await this.handlers[request.type].handle(tabId, muted) };
  }
}
