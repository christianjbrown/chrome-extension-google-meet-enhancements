import { TabMuter } from "../../src/window-mute/tab-muter";

function fakeTabs(mutedInfo?: { muted: boolean }) {
  return {
    get: vi.fn().mockResolvedValue(mutedInfo ? { mutedInfo } : {}),
    update: vi.fn().mockResolvedValue({}),
    sendMessage: vi.fn().mockResolvedValue(undefined),
  };
}

describe("TabMuter", () => {
  it("reports a tab's sound without changing it", async () => {
    const tabs = fakeTabs({ muted: true });

    const state = await new TabMuter(tabs).answer({ type: "mute-state" }, 7);

    expect(state).toEqual({ muted: true });
    expect(tabs.get).toHaveBeenCalledWith(7);
    expect(tabs.update).not.toHaveBeenCalled();
  });

  it("counts a tab Chrome says nothing about as audible", async () => {
    const state = await new TabMuter(fakeTabs()).answer(
      { type: "mute-state" },
      7,
    );

    expect(state).toEqual({ muted: false });
  });

  it("mutes an audible tab", async () => {
    const tabs = fakeTabs({ muted: false });

    const state = await new TabMuter(tabs).answer({ type: "toggle-mute" }, 7);

    expect(tabs.update).toHaveBeenCalledWith(7, { muted: true });
    expect(state).toEqual({ muted: true });
  });

  it("unmutes a muted tab", async () => {
    const tabs = fakeTabs({ muted: true });

    const state = await new TabMuter(tabs).answer({ type: "toggle-mute" }, 7);

    expect(tabs.update).toHaveBeenCalledWith(7, { muted: false });
    expect(state).toEqual({ muted: false });
  });

  it("tells a tab its sound changed", () => {
    const tabs = fakeTabs();

    new TabMuter(tabs).tell(7, true);

    expect(tabs.sendMessage).toHaveBeenCalledWith(7, {
      type: "mute-changed",
      muted: true,
    });
  });

  it("shrugs off a tab with nobody listening", async () => {
    const tabs = fakeTabs();
    const failed = Promise.reject(new Error("Receiving end does not exist"));
    tabs.sendMessage.mockReturnValue(failed);

    new TabMuter(tabs).tell(7, true);

    await expect(failed.catch(() => "handled")).resolves.toBe("handled");
  });
});
