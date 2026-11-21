// What the service worker's router needs from the tabs: one side answers a
// page's request about its own tab, the other tells a tab its sound changed.
import type { MuteRequest, MuteState } from "./messages";

export interface MuteAnswerer {
  answer(request: MuteRequest, tabId: number): Promise<MuteState>;
}

export interface MuteTeller {
  tell(tabId: number, muted: boolean): void;
}
