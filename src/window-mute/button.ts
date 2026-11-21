// The mute button as the window mute sees it: shown or hidden, showing the
// meeting's sound, and pressed.
export interface Button {
  show(): void;
  hide(): void;
  set(muted: boolean): void;
  onPress(listener: () => void): void;
}
