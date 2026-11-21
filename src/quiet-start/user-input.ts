// Tells when you first click or press a key. Only real presses count: the ones
// the extension makes itself are not trusted.
import type { EventSource } from "../event-source";

export interface UserInput {
  onPress(listener: () => void): void;
}

const PRESS_EVENTS = ["pointerdown", "keydown"] as const;

export class PageInput implements UserInput {
  constructor(private readonly source: EventSource) {}

  // Listens before Meet's own handlers get a look in.
  onPress(listener: () => void): void {
    for (const type of PRESS_EVENTS)
      this.source.addEventListener(
        type,
        (event) => {
          if (event.isTrusted) listener();
        },
        { capture: true },
      );
  }
}
