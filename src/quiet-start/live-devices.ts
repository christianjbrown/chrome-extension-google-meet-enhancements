// Finds Meet's microphone and camera buttons that are switched on, and presses
// them. Meet marks both with data-is-muted, in the pre-join screen and the
// call alike, so this works in any language.
export interface Devices {
  turnOffAll(): void;
  turnOff(node: Node): void;
}

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

export class LiveDevices implements Devices {
  // The attributes whose changes can switch a device on, for main.ts to hand
  // to whatever watches the page.
  static readonly WATCHED_ATTRIBUTES: readonly string[] = [MUTED_ATTRIBUTE];

  constructor(private readonly page: Node) {}

  turnOffAll(): void {
    this.turnOff(this.page);
  }

  turnOff(node: Node): void {
    // The whole page is a Document, and only an Element can itself match.
    if (!isSearchable(node)) return;
    const found = [...node.querySelectorAll<HTMLElement>(switchedOn)];
    if (isMatchable(node) && node.matches(switchedOn))
      found.unshift(node as HTMLElement);
    for (const button of found) button.click();
  }
}
