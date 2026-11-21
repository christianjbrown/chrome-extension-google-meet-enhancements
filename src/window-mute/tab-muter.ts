// Mutes and unmutes one tab, the way right-click "Mute site" would if it
// worked per tab. Muting a tab needs no permission, and an app or popup window
// is still a tab underneath, even though it has no tab strip to right-click.
import { MUTE_REQUEST } from "./messages";
import type { MuteRequest, MuteRequestType, MuteState } from "./messages";
import type { MuteAnswerer } from "./muter";

export interface Tabs {
  get(tabId: number): Promise<{ mutedInfo?: { muted: boolean } | undefined }>;
  update(tabId: number, properties: { muted: boolean }): Promise<unknown>;
}

// What each kind of request does, given the tab's sound now. A new kind of
// request is a new entry here.
type Handler = (tabs: Tabs, tabId: number, muted: boolean) => Promise<boolean>;

const handlers: Record<MuteRequestType, Handler> = {
  [MUTE_REQUEST.state]: (_tabs, _tabId, muted) => Promise.resolve(muted),
  [MUTE_REQUEST.toggle]: async (tabs, tabId, muted) => {
    await tabs.update(tabId, { muted: !muted });
    return !muted;
  },
};

export class TabMuter implements MuteAnswerer {
  constructor(private readonly tabs: Tabs) {}

  async answer(request: MuteRequest, tabId: number): Promise<MuteState> {
    const tab = await this.tabs.get(tabId);
    const muted = tab.mutedInfo?.muted ?? false;
    return { muted: await handlers[request.type](this.tabs, tabId, muted) };
  }
}
