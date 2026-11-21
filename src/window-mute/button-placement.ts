// Puts the mute button on meetings and takes it off every other page, and
// checks again whenever Meet moves to another address without reloading.
import type { Enhancement } from "../enhancement";
import { NAVIGATE_SUCCESS } from "../event-source";
import type { EventSource } from "../event-source";
import type { PlacedButton } from "./button";
import type { Page } from "./page";

export class ButtonPlacement implements Enhancement {
  constructor(
    private readonly page: Page,
    private readonly button: PlacedButton,
    private readonly navigation: EventSource,
  ) {}

  start(): void {
    this.place();
    this.navigation.addEventListener(NAVIGATE_SUCCESS, () => {
      this.place();
    });
  }

  private place(): void {
    if (this.page.isMeeting()) this.button.show();
    else this.button.hide();
  }
}
