// Accepts a request whose type is one the service worker has a handler for.
// worker.ts passes in the same table it gives TabMuter, so the two never
// disagree about which requests there are.
import { isUntrusted } from "./message-guards";
import type { MuteRequest, MuteRequestType } from "./messages";
import type { RequestGuard } from "./request-guard";

export class KnownRequests implements RequestGuard {
  constructor(
    private readonly known: Readonly<Record<MuteRequestType, unknown>>,
  ) {}

  accepts(message: unknown): message is MuteRequest {
    return isUntrusted<MuteRequest>(message) && this.isKnown(message.type);
  }

  // Its own key only, so nothing inherited such as toString counts.
  private isKnown(type: unknown): type is MuteRequestType {
    return typeof type === "string" && Object.hasOwn(this.known, type);
  }
}
