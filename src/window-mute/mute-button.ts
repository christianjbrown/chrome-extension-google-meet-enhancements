// The round button at the top of the meeting, drawn in its own shadow root so
// Meet's styles and ours never meet. Grey while you can hear the meeting, red
// with a struck-through speaker while you can't, like Meet's own mic button.
import { ICON_VIEW_BOX, SPEAKER, SPEAKER_OFF } from "./mute-icons";
import { MUTE_BUTTON_STYLE, PRESSED_ATTRIBUTE } from "./mute-button-style";
import type { Button } from "./button";

const HOST_TAG = "meet-enhancements-mute";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// The elements, attributes and event the button is built from.
const ELEMENT = {
  style: "style",
  button: "button",
  svg: "svg",
  path: "path",
} as const;
const ATTRIBUTE = {
  viewBox: "viewBox",
  hidden: "aria-hidden",
  label: "aria-label",
  pathData: "d",
} as const;
const PRESS_EVENT = "click";

// A plain button, so it never submits anything it happens to sit inside.
const BUTTON_TYPE = "button";
// The icon is decoration: the label already says what the button does.
const HIDDEN = String(true);
// Closed, so Meet's own scripts cannot reach into the button.
const SHADOW_MODE: ShadowRootMode = "closed";

// What the button says and shows for each state of the meeting's sound.
const AUDIBLE = { label: "Mute this meeting's sound", icon: SPEAKER };
const MUTED = { label: "Unmute this meeting's sound", icon: SPEAKER_OFF };

export class MuteButton implements Button {
  private readonly host: HTMLElement;
  private readonly button: HTMLButtonElement;
  private readonly icon: SVGPathElement;

  constructor(private readonly document: Document) {
    this.host = document.createElement(HOST_TAG);
    const style = document.createElement(ELEMENT.style);
    style.textContent = MUTE_BUTTON_STYLE;
    this.button = document.createElement(ELEMENT.button);
    this.button.type = BUTTON_TYPE;
    const svg = document.createElementNS(SVG_NAMESPACE, ELEMENT.svg);
    svg.setAttribute(ATTRIBUTE.viewBox, ICON_VIEW_BOX);
    svg.setAttribute(ATTRIBUTE.hidden, HIDDEN);
    this.icon = document.createElementNS(SVG_NAMESPACE, ELEMENT.path);
    svg.append(this.icon);
    this.button.append(svg);
    this.host.attachShadow({ mode: SHADOW_MODE }).append(style, this.button);
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
    this.button.setAttribute(ATTRIBUTE.label, label);
    this.button.title = label;
    this.icon.setAttribute(ATTRIBUTE.pathData, icon);
  }

  onPress(listener: () => void): void {
    this.button.addEventListener(PRESS_EVENT, listener);
  }
}
