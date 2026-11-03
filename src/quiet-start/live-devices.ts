// Finds Meet's microphone and camera buttons that are switched on, and presses
// them. Meet marks both with data-is-muted, in the pre-join screen and the
// call alike, so this works in any language.
export interface Devices {
  turnOffAll(): void;
  turnOff(node: Node): void;
}

const switchedOn = '[data-is-muted="false"]:is(button, [role="button"])';

export class LiveDevices implements Devices {
  constructor(private readonly page: Node) {}

  turnOffAll(): void {
    this.turnOff(this.page);
  }

  turnOff(node: Node): void {
    // The whole page is a Document, and only an Element can itself match.
    if (!(node instanceof Element || node instanceof Document)) return;
    const found = [...node.querySelectorAll<HTMLElement>(switchedOn)];
    if (node instanceof Element && node.matches(switchedOn))
      found.unshift(node as HTMLElement);
    for (const button of found) button.click();
  }
}
