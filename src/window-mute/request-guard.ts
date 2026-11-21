// Says whether a message is a request the service worker can answer.
import type { MuteRequest } from "./messages";

export interface RequestGuard {
  accepts(message: unknown): message is MuteRequest;
}
