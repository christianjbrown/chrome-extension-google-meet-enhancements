// What the page and the service worker say to each other. Only the service
// worker can mute a tab, so the page asks it to.
import type { STATE_REQUEST } from "./state-request";
import type { TOGGLE_REQUEST } from "./toggle-request";

// Each request's type is declared in its own module, so a new request is a new
// module and one line here.
export type MuteRequestType = typeof STATE_REQUEST | typeof TOGGLE_REQUEST;

export interface MuteRequest {
  type: MuteRequestType;
}

// The service worker's answer to either request: the tab's sound after it.
export interface MuteState {
  muted: boolean;
}

export const MUTE_CHANGED = "mute-changed";

// Sent to the page whenever its tab is muted or unmuted, by this extension or
// by anything else, so the button never shows a stale state.
export interface MuteChanged {
  type: typeof MUTE_CHANGED;
  muted: boolean;
}

export function isMuteChanged(message: unknown): message is MuteChanged {
  return isObject(message) && hasMuteChangedFields(message);
}

function isObject(message: unknown): message is object {
  return typeof message === "object" && message !== null;
}

function hasMuteChangedFields(message: Partial<MuteChanged>): boolean {
  return message.type === MUTE_CHANGED && typeof message.muted === "boolean";
}
