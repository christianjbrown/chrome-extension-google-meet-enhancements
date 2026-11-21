import { SoundSync } from "../../src/window-mute/sound-sync";

function setup(state = () => Promise.resolve(true)) {
  let press = () => undefined as unknown;
  let change: (muted: boolean) => void = (_muted) => undefined;
  const button = {
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
  new SoundSync(button, sound).start();
  return {
    button,
    sound,
    press: () => press(),
    change: (muted: boolean) => {
      change(muted);
    },
  };
}

describe("SoundSync", () => {
  it("sets the button to the tab's current sound", async () => {
    const { button } = setup();

    await vi.waitFor(() => {
      expect(button.set).toHaveBeenCalledWith(true);
    });
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
    const { button, sound } = setup(() =>
      Promise.reject(new Error("Extension context invalidated")),
    );

    await expect(sound.state.mock.results[0]!.value).rejects.toThrow();
    expect(button.set).not.toHaveBeenCalled();
  });
});
