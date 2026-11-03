// The round button at the top of the meeting, drawn in its own shadow root so
// Meet's styles and ours never meet. Grey while you can hear the meeting, red
// with a struck-through speaker while you can't, like Meet's own mic button.
export interface Button {
  show(): void;
  hide(): void;
  set(muted: boolean): void;
  onPress(listener: () => void): void;
}

const speaker =
  "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
const speakerOff =
  "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z";

const svgNamespace = "http://www.w3.org/2000/svg";

const styles = `
  button {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483647;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    padding: 8px;
    background: #3c4043;
    color: #e3e3e3;
    cursor: pointer;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.4);
  }
  button:hover { filter: brightness(1.15); }
  button:focus-visible { outline: 2px solid #a8c7fa; outline-offset: 2px; }
  button[aria-pressed="true"] { background: #ea4335; color: #fff; }
  svg { display: block; width: 24px; height: 24px; fill: currentColor; }
`;

export class MuteButton implements Button {
  private readonly host: HTMLElement;
  private readonly button: HTMLButtonElement;
  private readonly icon: SVGPathElement;

  constructor(private readonly document: Document) {
    this.host = document.createElement("meet-enhancements-mute");
    const style = document.createElement("style");
    style.textContent = styles;
    this.button = document.createElement("button");
    this.button.type = "button";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    this.icon = document.createElementNS(svgNamespace, "path");
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
    const label = muted
      ? "Unmute this meeting's sound"
      : "Mute this meeting's sound";
    this.button.setAttribute("aria-pressed", String(muted));
    this.button.setAttribute("aria-label", label);
    this.button.title = label;
    this.icon.setAttribute("d", muted ? speakerOff : speaker);
  }

  onPress(listener: () => void): void {
    this.button.addEventListener("click", listener);
  }
}
