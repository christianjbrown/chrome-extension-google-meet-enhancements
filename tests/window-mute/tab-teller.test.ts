import { TabTeller } from "../../src/window-mute/tab-teller";

function fakeTabs() {
  return { sendMessage: vi.fn().mockResolvedValue(undefined) };
}

describe("TabTeller", () => {
  it("tells a tab its sound changed", () => {
    const tabs = fakeTabs();

    new TabTeller(tabs).tell(7, true);

    expect(tabs.sendMessage).toHaveBeenCalledWith(7, {
      type: "mute-changed",
      muted: true,
    });
  });

  it("shrugs off a tab with nobody listening", async () => {
    const tabs = fakeTabs();
    const failed = Promise.reject(new Error("Receiving end does not exist"));
    tabs.sendMessage.mockReturnValue(failed);

    new TabTeller(tabs).tell(7, true);

    await expect(failed.catch(() => "handled")).resolves.toBe("handled");
  });
});
