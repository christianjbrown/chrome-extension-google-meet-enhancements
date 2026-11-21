// Answers "is this tab muted?" without changing anything.
import type { MuteRequestHandler, TabSoundNow } from "./mute-request-handler";

export class ReportMute implements MuteRequestHandler {
  handle(tab: TabSoundNow): Promise<boolean> {
    return Promise.resolve(tab.muted);
  }
}
