// The service worker's news for a Meet page: tells a tab whenever its sound
// changes. worker.ts only hooks this up to chrome's tab update event.
import type { MuteTeller } from "./muter";

export class SoundChangeRouter {
  constructor(private readonly teller: MuteTeller) {}

  onTabUpdated(
    tabId: number,
    change: { mutedInfo?: { muted: boolean } | undefined },
  ): void {
    if (change.mutedInfo) this.teller.tell(tabId, change.mutedInfo.muted);
  }
}
