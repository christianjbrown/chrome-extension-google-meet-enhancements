import { PageInput } from "../../src/quiet-start/page-input";

function setup() {
  const heard: Record<string, (event: Event) => void> = {};
  const source = {
    addEventListener: vi.fn(
      (type: string, listener: (event: Event) => void) => {
        heard[type] = listener;
      },
    ),
  };
  const listener = vi.fn();
  new PageInput(source).onPress(listener);
  // jsdom will not let a test fake a trusted event, so the listener gets
  // just the part it reads.
  const press = (type: string, trusted = true) => {
    heard[type]!({ isTrusted: trusted } as Event);
  };
  return { source, listener, press };
}

describe("PageInput", () => {
  it("listens before Meet's own handlers get a look in", () => {
    const { source } = setup();

    expect(source.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
      { capture: true },
    );
  });

  it.each(["pointerdown", "keydown"])("reports a real %s", (type) => {
    const { listener, press } = setup();

    press(type);

    expect(listener).toHaveBeenCalledOnce();
  });

  it("ignores presses the extension made itself", () => {
    const { listener, press } = setup();

    press("pointerdown", false);

    expect(listener).not.toHaveBeenCalled();
  });
});
