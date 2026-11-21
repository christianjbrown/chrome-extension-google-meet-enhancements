import type { MuteRequestHandler } from "../../src/window-mute/mute-request-handler";
import { TabMuter } from "../../src/window-mute/tab-muter";

function fakeTabs(mutedInfo?: { muted: boolean }) {
  return { get: vi.fn().mockResolvedValue(mutedInfo ? { mutedInfo } : {}) };
}

function fakeHandler(answer: boolean) {
  return {
    handle: vi.fn<MuteRequestHandler["handle"]>().mockResolvedValue(answer),
  };
}

describe("TabMuter", () => {
  it("hands the request to the handler for its type", async () => {
    const tabs = fakeTabs({ muted: true });
    const state = fakeHandler(true);
    const toggle = fakeHandler(false);

    const answer = await new TabMuter(tabs, {
      "mute-state": state,
      "toggle-mute": toggle,
    }).answer({ type: "toggle-mute" }, 7);

    expect(tabs.get).toHaveBeenCalledWith(7);
    expect(toggle.handle).toHaveBeenCalledWith({ tabId: 7, muted: true });
    expect(state.handle).not.toHaveBeenCalled();
    expect(answer).toEqual({ muted: false });
  });

  it("counts a tab Chrome says nothing about as audible", async () => {
    const state = fakeHandler(false);

    await new TabMuter(fakeTabs(), {
      "mute-state": state,
      "toggle-mute": fakeHandler(true),
    }).answer({ type: "mute-state" }, 7);

    expect(state.handle).toHaveBeenCalledWith({ tabId: 7, muted: false });
  });
});
