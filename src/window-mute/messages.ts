// What the page and the service worker say to each other. Only the service
// worker can mute a tab, so the page asks it to.
export type MuteRequest = { type: "mute-state" } | { type: "toggle-mute" };

// The service worker's answer to either request: the tab's sound after it.
export interface MuteState {
  muted: boolean;
}

// Sent to the page whenever its tab is muted or unmuted, by this extension or
// by anything else, so the button never shows a stale state.
export interface MuteChanged {
  type: "mute-changed";
  muted: boolean;
}

export function isMuteChanged(message: unknown): message is MuteChanged {
  return (
    typeof message === "object" &&
    message !== null &&
    (message as Partial<MuteChanged>).type === "mute-changed" &&
    typeof (message as Partial<MuteChanged>).muted === "boolean"
  );
}
