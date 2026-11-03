import { QuietStart } from "../../src/quiet-start/quiet-start";

function setup(url: string | null = "https://meet.google.com/abc-defg-hij") {
  const heard: Record<string, (event: Event) => void> = {};
  const user = {
    addEventListener: vi.fn(
      (type: string, listener: (event: Event) => void) => {
        heard[type] = listener;
      },
    ),
  };
  const navigation: EventTarget & {
    currentEntry: { url: string | null } | null;
  } = Object.assign(new EventTarget(), { currentEntry: { url } });
  const devices = { turnOffAll: vi.fn(), turnOff: vi.fn() };
  let changed: (node: Node) => void = (_node) => undefined;
  const stop = vi.fn();
  const watcher = {
    watch: vi.fn((listener: (node: Node) => void) => {
      changed = listener;
      return stop;
    }),
  };
  new QuietStart(devices, watcher, user, navigation).start();
  return {
    user,
    devices,
    watcher,
    stop,
    navigation,
    change: (node: Node) => {
      changed(node);
    },
    // jsdom will not let a test fake a trusted event, so the listener gets
    // just the part it reads.
    press: (type: string, trusted = true) => {
      heard[type]!({ isTrusted: trusted } as Event);
    },
    moveTo: (next: string | null) => {
      navigation.currentEntry = next === null ? null : { url: next };
      navigation.dispatchEvent(new Event("navigatesuccess"));
    },
  };
}

describe("QuietStart", () => {
  it("turns off what is on now, then whatever Meet switches on later", () => {
    const { devices, change } = setup();
    const button = document.createElement("button");

    change(button);

    expect(devices.turnOffAll).toHaveBeenCalledOnce();
    expect(devices.turnOff).toHaveBeenCalledWith(button);
  });

  it("listens before Meet's own handlers get a look in", () => {
    const { user } = setup();

    expect(user.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
      { capture: true },
    );
  });

  it.each(["pointerdown", "keydown"])(
    "goes hands off at the first real %s",
    (type) => {
      const { stop, press } = setup();

      press(type);

      expect(stop).toHaveBeenCalledOnce();
    },
  );

  it("keeps going through presses it made itself", () => {
    const { stop, press } = setup();

    press("pointerdown", false);

    expect(stop).not.toHaveBeenCalled();
  });

  it("starts quiet again in a different meeting", () => {
    const { devices, watcher, stop, press, moveTo } = setup();
    press("keydown");

    moveTo("https://meet.google.com/xyz-abcd-efg");

    expect(devices.turnOffAll).toHaveBeenCalledTimes(2);
    expect(watcher.watch).toHaveBeenCalledTimes(2);
    expect(stop).toHaveBeenCalledOnce();
  });

  it("leaves the same meeting alone when only the query changes", () => {
    const { devices, moveTo } = setup();

    moveTo("https://meet.google.com/abc-defg-hij?authuser=1");

    expect(devices.turnOffAll).toHaveBeenCalledOnce();
  });

  it("copes with Meet not saying where it is", () => {
    const { devices, moveTo } = setup(null);

    moveTo(null);
    expect(devices.turnOffAll).toHaveBeenCalledOnce();

    moveTo("https://meet.google.com/abc-defg-hij");
    expect(devices.turnOffAll).toHaveBeenCalledTimes(2);
  });
});
