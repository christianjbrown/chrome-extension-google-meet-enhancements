// Checks that a message has every field its type promises, before either side
// of the conversation reads it. Both sides are built apart, so neither trusts
// what the other sends until it has looked.
import { MUTE_CHANGED } from "./messages";
import type { MuteChanged, MuteState } from "./messages";

// An object whose fields are all still to be checked.
export type Untrusted<T> = Partial<Readonly<Record<keyof T, unknown>>>;

export function isUntrusted<T>(value: unknown): value is Untrusted<T> {
  return typeof value === "object" && value !== null;
}

function hasMuteChangedFields(message: Untrusted<MuteChanged>): boolean {
  return message.type === MUTE_CHANGED && typeof message.muted === "boolean";
}

export function isMuteChanged(message: unknown): message is MuteChanged {
  return isUntrusted<MuteChanged>(message) && hasMuteChangedFields(message);
}

export function isMuteState(answer: unknown): answer is MuteState {
  return isUntrusted<MuteState>(answer) && typeof answer.muted === "boolean";
}
