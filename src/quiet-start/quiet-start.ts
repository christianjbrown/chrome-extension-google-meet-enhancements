// Every meeting starts with the microphone and camera off. Anything switched
// on before you first click or press a key is Meet's default, not your choice,
// so it gets turned off. From your first click or key on, it's hands off, and
// joining always takes one, so it never fights you inside the call.
import type { Enhancement } from "../enhancement";
import type { Watcher } from "../watcher";
import type { Devices } from "./devices";
import type { MeetingChanges } from "./meeting-changes";
import type { UserInput } from "./user-input";

export class QuietStart implements Enhancement {
  private stop: (() => void) | undefined;

  constructor(
    private readonly devices: Devices,
    private readonly watcher: Watcher,
    private readonly input: UserInput,
    private readonly meetings: MeetingChanges,
  ) {}

  start(): void {
    this.input.onPress(() => {
      this.disarm();
    });
    // Meet can move to another meeting without reloading, and that one
    // starts quiet too.
    this.meetings.onChange(() => {
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

  private disarm(): void {
    this.stop?.();
    this.stop = undefined;
  }
}
