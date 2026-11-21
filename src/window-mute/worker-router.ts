// The service worker's side of the conversation: answers the tab a Meet page
// asks about, and tells a tab whenever its sound changes. worker.ts only
// hooks these up to chrome's events.
import type { MuteRequest, MuteState } from "./messages";
import type { MuteAnswerer, MuteTeller } from "./muter";

export type Respond = (answer: MuteState | undefined) => void;

export class WorkerRouter {
  constructor(
    private readonly answerer: MuteAnswerer,
    private readonly teller: MuteTeller,
  ) {}

  // Returns whether the reply channel stays open until the answer arrives.
  onMessage(
    request: MuteRequest,
    sender: { tab?: { id?: number | undefined } | undefined },
    respond: Respond,
  ): boolean {
    const tabId = sender.tab?.id;
    if (tabId === undefined) return false;
    this.answerer.answer(request, tabId).then(respond, () => {
      respond(undefined);
    });
    return true;
  }

  onTabUpdated(
    tabId: number,
    change: { mutedInfo?: { muted: boolean } | undefined },
  ): void {
    if (change.mutedInfo) this.teller.tell(tabId, change.mutedInfo.muted);
  }
}
