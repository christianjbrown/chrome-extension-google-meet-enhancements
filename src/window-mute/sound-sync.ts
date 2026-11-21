// Keeps the mute button in step with this meeting's sound, and only this
// one's, so two meetings at once can each be heard or silenced on their own.
// Pressing the button flips the sound.
import type { Enhancement } from "../enhancement";
import type { SoundButton } from "./button";
import type { Switch } from "./switch";

export class SoundSync implements Enhancement {
  constructor(
    private readonly button: SoundButton,
    private readonly sound: Switch,
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
  }
}
