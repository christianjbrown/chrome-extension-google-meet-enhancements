import { MuteButton } from "../../src/window-mute/mute-button";

// The shadow root is closed, so the tests reach in the way Chrome's own
// devtools would, by catching it as it is made.
function make() {
  let root: ShadowRoot | undefined;
  const attach = HTMLElement.prototype.attachShadow;
  vi.spyOn(HTMLElement.prototype, "attachShadow").mockImplementation(function (
    this: HTMLElement,
    init: ShadowRootInit,
  ) {
    root = attach.call(this, init);
    return root;
  });
  const button = new MuteButton(document);
  return { button, inner: () => root!.querySelector("button")! };
}

describe("MuteButton", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("starts out offering to mute", () => {
    const { inner } = make();

    expect(inner().getAttribute("aria-pressed")).toBe("false");
    expect(inner().getAttribute("aria-label")).toBe(
      "Mute this meeting's sound",
    );
    expect(inner().title).toBe("Mute this meeting's sound");
  });

  it("shows when the meeting is muted, with a different icon", () => {
    const { button, inner } = make();
    const audible = inner().querySelector("path")!.getAttribute("d");

    button.set(true);

    expect(inner().getAttribute("aria-pressed")).toBe("true");
    expect(inner().getAttribute("aria-label")).toBe(
      "Unmute this meeting's sound",
    );
    expect(inner().querySelector("path")!.getAttribute("d")).not.toBe(audible);
  });

  it("puts itself on the page once, and takes itself off", () => {
    const { button } = make();

    button.show();
    button.show();
    expect(document.querySelectorAll("meet-enhancements-mute")).toHaveLength(1);

    button.hide();
    expect(document.querySelector("meet-enhancements-mute")).toBeNull();
  });

  it("reports presses", () => {
    const { button, inner } = make();
    const pressed = vi.fn();
    button.onPress(pressed);

    inner().click();

    expect(pressed).toHaveBeenCalledOnce();
  });
});
