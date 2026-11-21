// Hears your clicks and key presses on the page. Only real presses count: the
// ones the extension makes itself are not trusted.
import type { EventSource } from "../event-source";
import type { UserInput } from "./user-input";

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
