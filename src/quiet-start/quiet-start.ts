// Every meeting starts with the microphone and camera off. Anything switched
// on before you first click or press a key is Meet's default, not your choice,
// so it gets turned off. From your first click or key on, it's hands off, and
// joining always takes one, so it never fights you inside the call.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import type { Watcher } from "../node-watcher";
import type { Devices } from "./live-devices";

// Where Meet is, and when it moves. main.ts hands over the window's navigation.
export interface Navigation extends EventSource {
  readonly currentEntry: { readonly url: string | null } | null;
}

export class QuietStart implements Enhancement {
  private stop: (() => void) | undefined;
  private address: string | undefined;

  constructor(
    private readonly devices: Devices,
    private readonly watcher: Watcher,
    private readonly user: EventSource,
    private readonly navigation: Navigation,
  ) {}

  start(): void {
    // Only real presses count. The ones this makes itself are not trusted.
    const handsOff = (event: Event) => {
      if (event.isTrusted) this.disarm();
    };
    for (const type of ["pointerdown", "keydown"])
      this.user.addEventListener(type, handsOff, { capture: true });
    // Meet can move to another meeting without reloading, and that one
    // starts quiet too. Joining the same meeting is not a new one.
    this.address = this.meeting();
    this.navigation.addEventListener("navigatesuccess", () => {
      if (this.meeting() === this.address) return;
      this.address = this.meeting();
      this.arm();
    });
    this.arm();
  }

  private arm(): void {
    this.disarm();
    this.devices.turnOffAll();
    this.stop = this.watcher.watch((node) => {
      this.devices.turnOff(node);
    });
  }

  // The path alone, so Meet adding ?authuser= or similar is not a new meeting.
  private meeting(): string | undefined {
    const url = this.navigation.currentEntry?.url;
    return url ? new URL(url).pathname : undefined;
  }

  private disarm(): void {
    this.stop?.();
    this.stop = undefined;
  }
}
