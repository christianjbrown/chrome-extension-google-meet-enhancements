// The service worker's answer to a Meet page: passes the page's request about
// its own tab to the answerer and sends the reply back. worker.ts only hooks
// this up to chrome's message event.
import type { MuteRequest, MuteState } from "./messages";
import type { MuteAnswerer } from "./muter";

export type Respond = (answer: MuteState | undefined) => void;

export class RequestRouter {
  constructor(private readonly answerer: MuteAnswerer) {}

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
}
