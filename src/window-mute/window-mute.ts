// A button that mutes the sound coming out of this meeting's window, and only
// this one, so two meetings at once can each be heard or silenced on their own.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import type { Page } from "./meeting-page";
import type { Button } from "./mute-button";
import type { Switch } from "./worker-switch";

export class WindowMute implements Enhancement {
  constructor(
    private readonly page: Page,
    private readonly button: Button,
    private readonly sound: Switch,
    private readonly navigation: EventSource,
  ) {}

  start(): void {
    const set = (muted: boolean) => {
      this.button.set(muted);
    };
    // If the extension has just been reloaded, this page can no longer reach
    // it, and the button stays as it was until Meet is reloaded too.
    const ignore = () => undefined;
    this.button.onPress(() => {
      this.sound.toggle().then(set, ignore);
    });
    this.sound.onChange(set);
    this.sound.state().then(set, ignore);
    this.place();
    // Meet moves between its landing page and a meeting without reloading.
    this.navigation.addEventListener("navigatesuccess", () => {
      this.place();
    });
  }

  private place(): void {
    if (this.page.isMeeting()) this.button.show();
    else this.button.hide();
  }
}
