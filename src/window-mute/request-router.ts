// The service worker's answer to a Meet page: passes the page's request about
// its own tab to the answerer and sends the reply back. worker.ts only hooks
// this up to chrome's message event.
import type { MuteRequest, MuteState } from "./messages";
import type { MuteAnswerer } from "./muter";
import type { RequestGuard } from "./request-guard";

export type Respond = (answer: MuteState | undefined) => void;

// Whoever sent the request: a Meet page has a tab, anything else may not.
interface RequestSender {
  tab?: { id?: number | undefined } | undefined;
}

const tabIdOf = (sender: RequestSender): number | undefined => sender.tab?.id;

export class RequestRouter {
  constructor(
    private readonly answerer: MuteAnswerer,
    private readonly requests: RequestGuard,
  ) {}

  // Returns whether the reply channel stays open until the answer arrives. A
  // message that is not a request it knows is ignored.
  onMessage(
    message: unknown,
    sender: RequestSender,
    respond: Respond,
  ): boolean {
    return (
      this.requests.accepts(message) && this.answer(message, sender, respond)
    );
  }

  private answer(
    request: MuteRequest,
    sender: RequestSender,
    respond: Respond,
  ): boolean {
    const tabId = tabIdOf(sender);
    if (tabId === undefined) return false;
    this.answerer.answer(request, tabId).then(respond, () => {
      respond(undefined);
    });
    return true;
  }
}
