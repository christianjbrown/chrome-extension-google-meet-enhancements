// Finds Meet's microphone and camera buttons that are switched on, and presses
// them. Meet marks both with data-is-muted, in the pre-join screen and the
// call alike, so this works in any language.
import type { Devices } from "./devices";

// The attribute Meet puts on its device buttons, and the value while on.
const MUTED_ATTRIBUTE = "data-is-muted";
const SWITCHED_ON_VALUE = "false";

// Meet draws some device buttons as buttons and some as divs playing one.
const BUTTON_LIKE = ':is(button, [role="button"])';

const switchedOn = `[${MUTED_ATTRIBUTE}="${SWITCHED_ON_VALUE}"]${BUTTON_LIKE}`;

// Node.nodeType values, read off the node so no page class is needed.
const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;

type Searchable = Node & ParentNode;
type Matchable = Searchable & Element;

function isSearchable(node: Node): node is Searchable {
  return node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE;
}

function isMatchable(node: Node): node is Matchable {
  return node.nodeType === ELEMENT_NODE;
}

// Only an Element can itself match.
function isSwitchedOn(node: Searchable): boolean {
  return isMatchable(node) && node.matches(switchedOn);
}

function selfIfSwitchedOn(node: Searchable): HTMLElement[] {
  return isSwitchedOn(node) ? [node as HTMLElement] : [];
}

// The node itself first, then the buttons inside it.
function switchedOnIn(node: Searchable): HTMLElement[] {
  return [
    ...selfIfSwitchedOn(node),
    ...node.querySelectorAll<HTMLElement>(switchedOn),
  ];
}

function pressAll(buttons: HTMLElement[]): void {
  buttons.forEach((button) => {
    button.click();
  });
}

export class LiveDevices implements Devices {
  // The attributes whose changes can switch a device on, for main.ts to hand
  // to whatever watches the page.
  static readonly WATCHED_ATTRIBUTES: readonly string[] = [MUTED_ATTRIBUTE];

  constructor(private readonly page: Node) {}

  turnOffAll(): void {
    this.turnOff(this.page);
  }

  turnOff(node: Node): void {
    // The whole page is a Document, which can be searched but not matched.
    if (isSearchable(node)) pressAll(switchedOnIn(node));
  }
}
