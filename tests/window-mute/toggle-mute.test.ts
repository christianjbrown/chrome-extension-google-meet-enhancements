import { ToggleMute } from "../../src/window-mute/toggle-mute";

function fakeTabs() {
  return { update: vi.fn().mockResolvedValue({}) };
}

describe("ToggleMute", () => {
  it("mutes an audible tab", async () => {
    const tabs = fakeTabs();

    const muted = await new ToggleMute(tabs).handle({ tabId: 7, muted: false });

    expect(tabs.update).toHaveBeenCalledWith(7, { muted: true });
    expect(muted).toBe(true);
  });

  it("unmutes a muted tab", async () => {
    const tabs = fakeTabs();

    const muted = await new ToggleMute(tabs).handle({ tabId: 7, muted: true });

    expect(tabs.update).toHaveBeenCalledWith(7, { muted: false });
    expect(muted).toBe(false);
  });
});
