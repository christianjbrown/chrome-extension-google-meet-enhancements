import { QuietStart } from "../../src/quiet-start/quiet-start";

function setup() {
  let pressed: () => void = () => undefined;
  let moved: () => void = () => undefined;
  const input = {
    onPress: vi.fn((listener: () => void) => {
      pressed = listener;
    }),
  };
  const meetings = {
    onChange: vi.fn((listener: () => void) => {
      moved = listener;
    }),
  };
  const devices = { turnOffAll: vi.fn(), turnOff: vi.fn() };
  let changed: (node: Node) => void = (_node) => undefined;
  const stop = vi.fn();
  const watcher = {
    watch: vi.fn((listener: (node: Node) => void) => {
      changed = listener;
      return stop;
    }),
  };
  new QuietStart(devices, watcher, input, meetings).start();
  return {
    devices,
    watcher,
    stop,
    change: (node: Node) => {
      changed(node);
    },
    press: () => {
      pressed();
    },
    moveToAnotherMeeting: () => {
      moved();
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

  it("goes hands off at the first press", () => {
    const { stop, press } = setup();

    press();

    expect(stop).toHaveBeenCalledOnce();
  });

  it("stays hands off when pressed again", () => {
    const { stop, press } = setup();

    press();
    press();

    expect(stop).toHaveBeenCalledOnce();
  });

  it("starts quiet again in a different meeting", () => {
    const { devices, watcher, stop, press, moveToAnotherMeeting } = setup();
    press();

    moveToAnotherMeeting();

    expect(devices.turnOffAll).toHaveBeenCalledTimes(2);
    expect(watcher.watch).toHaveBeenCalledTimes(2);
    expect(stop).toHaveBeenCalledOnce();
  });
});
