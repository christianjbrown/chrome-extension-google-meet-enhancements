// What one kind of page request does to its tab, given the tab's sound now.
// Each kind is its own class, and worker.ts lists them by request type.
import type { MuteRequestType } from "./messages";

export interface MuteRequestHandler {
  // Resolves to the tab's sound once the request has been carried out.
  handle(tabId: number, muted: boolean): Promise<boolean>;
}

export type MuteRequestHandlers = Readonly<
  Record<MuteRequestType, MuteRequestHandler>
>;
