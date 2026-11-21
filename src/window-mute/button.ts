// The mute button, split by who uses it. Placement only shows and hides it;
// the sound sync only sets what it shows and hears it pressed.
export interface PlacedButton {
  show(): void;
  hide(): void;
}

export interface SoundButton {
  set(muted: boolean): void;
  onPress(listener: () => void): void;
}
