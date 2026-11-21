// What one kind of page request does to its tab, given the tab's sound now.
// Each kind is its own class, and worker.ts lists them by request type.
import type { MuteRequestType } from "./messages";

export interface MuteRequestHandler {
  // Resolves to the tab's sound once the request has been carried out.
  handle(tab: TabSoundNow): Promise<boolean>;
}

// The tab a request is about, and whether it is muted now. One value, so a
// handler that needs only the sound reads only that.
export interface TabSoundNow {
  readonly tabId: number;
  readonly muted: boolean;
}

export type MuteRequestHandlers = Readonly<
  Record<MuteRequestType, MuteRequestHandler>
>;
