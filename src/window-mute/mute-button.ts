// The round button at the top of the meeting, drawn in its own shadow root so
// Meet's styles and ours never meet. Grey while you can hear the meeting, red
// with a struck-through speaker while you can't, like Meet's own mic button.
import { ICON_VIEW_BOX, SPEAKER, SPEAKER_OFF } from "./mute-icons";
import { MUTE_BUTTON_STYLE, PRESSED_ATTRIBUTE } from "./mute-button-style";

export interface Button {
  show(): void;
  hide(): void;
  set(muted: boolean): void;
  onPress(listener: () => void): void;
}

const HOST_TAG = "meet-enhancements-mute";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// What the button says and shows for each state of the meeting's sound.
const AUDIBLE = { label: "Mute this meeting's sound", icon: SPEAKER };
const MUTED = { label: "Unmute this meeting's sound", icon: SPEAKER_OFF };

export class MuteButton implements Button {
  private readonly host: HTMLElement;
  private readonly button: HTMLButtonElement;
  private readonly icon: SVGPathElement;

  constructor(private readonly document: Document) {
    this.host = document.createElement(HOST_TAG);
    const style = document.createElement("style");
    style.textContent = MUTE_BUTTON_STYLE;
    this.button = document.createElement("button");
    this.button.type = "button";
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("viewBox", ICON_VIEW_BOX);
    svg.setAttribute("aria-hidden", "true");
    this.icon = document.createElementNS(SVG_NAMESPACE, "path");
    svg.append(this.icon);
    this.button.append(svg);
    this.host.attachShadow({ mode: "closed" }).append(style, this.button);
    this.set(false);
  }

  show(): void {
    if (!this.host.isConnected) this.document.body.append(this.host);
  }

  hide(): void {
    this.host.remove();
  }

  set(muted: boolean): void {
    const { label, icon } = muted ? MUTED : AUDIBLE;
    this.button.setAttribute(PRESSED_ATTRIBUTE, String(muted));
    this.button.setAttribute("aria-label", label);
    this.button.title = label;
    this.icon.setAttribute("d", icon);
  }

  onPress(listener: () => void): void {
    this.button.addEventListener("click", listener);
  }
}
