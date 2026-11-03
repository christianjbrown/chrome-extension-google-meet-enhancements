import { WindowMute } from "../../src/window-mute/window-mute";

function setup(meeting = true, state = () => Promise.resolve(true)) {
  let press = () => undefined as unknown;
  let change: (muted: boolean) => void = (_muted) => undefined;
  let navigated = () => undefined as unknown;
  const page = { isMeeting: vi.fn(() => meeting) };
  const button = {
    show: vi.fn(),
    hide: vi.fn(),
    set: vi.fn(),
    onPress: (listener: () => void) => {
      press = listener;
    },
  };
  const sound = {
    state: vi.fn(state),
    toggle: vi.fn().mockResolvedValue(false),
    onChange: (listener: (muted: boolean) => void) => {
      change = listener;
    },
  };
  const navigation = {
    addEventListener: vi.fn((_type: string, listener: () => void) => {
      navigated = listener;
    }),
  };
  new WindowMute(page, button, sound, navigation).start();
  return {
    page,
    button,
    sound,
    navigation,
    press: () => press(),
    change: (muted: boolean) => {
      change(muted);
    },
    navigated: () => navigated(),
  };
}

describe("WindowMute", () => {
  it("shows the button on a meeting, set to the tab's current sound", async () => {
    const { button } = setup();

    expect(button.show).toHaveBeenCalled();
    await vi.waitFor(() => {
      expect(button.set).toHaveBeenCalledWith(true);
    });
  });

  it("keeps the button off pages that are not meetings", () => {
    const { button } = setup(false);

    expect(button.hide).toHaveBeenCalled();
    expect(button.show).not.toHaveBeenCalled();
  });

  it("flips the sound when pressed, and shows the result", async () => {
    const { button, sound, press } = setup();

    press();

    expect(sound.toggle).toHaveBeenCalled();
    await vi.waitFor(() => {
      expect(button.set).toHaveBeenLastCalledWith(false);
    });
  });

  it("follows changes made anywhere else", () => {
    const { button, change } = setup();

    change(false);

    expect(button.set).toHaveBeenLastCalledWith(false);
  });

  it("leaves the button alone when the extension cannot be reached", async () => {
    const { button, sound, press } = setup();
    await vi.waitFor(() => {
      expect(button.set).toHaveBeenCalledTimes(1);
    });
    sound.toggle.mockRejectedValue(new Error("Extension context invalidated"));

    press();
    await Promise.resolve();
    await Promise.resolve();

    expect(button.set).toHaveBeenCalledTimes(1);
  });

  it("ignores a failed first look at the sound", async () => {
    const { button, sound } = setup(true, () =>
      Promise.reject(new Error("Extension context invalidated")),
    );

    await expect(sound.state.mock.results[0]!.value).rejects.toThrow();
    expect(button.set).not.toHaveBeenCalled();
  });

  it("checks again after Meet moves to another page", () => {
    const { page, button, navigation, navigated } = setup();
    expect(navigation.addEventListener).toHaveBeenCalledWith(
      "navigatesuccess",
      expect.any(Function),
    );
    page.isMeeting.mockReturnValue(false);

    navigated();

    expect(button.hide).toHaveBeenCalled();
  });
});
