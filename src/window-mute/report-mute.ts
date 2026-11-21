// Answers "is this tab muted?" without changing anything.
import type { MuteRequestHandler } from "./mute-request-handler";

export class ReportMute implements MuteRequestHandler {
  handle(_tabId: number, muted: boolean): Promise<boolean> {
    return Promise.resolve(muted);
  }
}
