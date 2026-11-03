// Drives the service worker's wiring through a fake chrome, end to end.
type Listener = (...args: unknown[]) => unknown;

function fakeEvent() {
  const listeners: Listener[] = [];
  return {
    addListener: vi.fn((listener: Listener) => listeners.push(listener)),
    fire: (...args: unknown[]) =>
      listeners.map((listener) => listener(...args)),
  };
}

async function load() {
  vi.resetModules();
  const chrome = {
    runtime: { onMessage: fakeEvent() },
    tabs: {
      onUpdated: fakeEvent(),
      get: vi.fn().mockResolvedValue({ mutedInfo: { muted: false } }),
      update: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn().mockResolvedValue(undefined),
    },
  };
  vi.stubGlobal("chrome", chrome);
  await import("../src/worker");
  return chrome;
}

describe("service worker", () => {
  it("mutes the tab that asked, and answers asynchronously", async () => {
    const chrome = await load();
    const respond = vi.fn();

    const [keepOpen] = chrome.runtime.onMessage.fire(
      { type: "toggle-mute" },
      { tab: { id: 4 } },
      respond,
    );

    expect(keepOpen).toBe(true);
    await vi.waitFor(() => {
      expect(respond).toHaveBeenCalledWith({ muted: true });
    });
    expect(chrome.tabs.update).toHaveBeenCalledWith(4, { muted: true });
  });

  it("answers with nothing when the tab cannot be read", async () => {
    const chrome = await load();
    chrome.tabs.get.mockRejectedValue(new Error("No tab with id: 4"));
    const respond = vi.fn();

    chrome.runtime.onMessage.fire(
      { type: "mute-state" },
      { tab: { id: 4 } },
      respond,
    );

    await vi.waitFor(() => {
      expect(respond).toHaveBeenCalledWith(undefined);
    });
  });

  it("ignores messages that do not come from a tab", async () => {
    const chrome = await load();
    const respond = vi.fn();

    const [keepOpen] = chrome.runtime.onMessage.fire(
      { type: "toggle-mute" },
      {},
      respond,
    );

    expect(keepOpen).toBe(false);
    expect(chrome.tabs.get).not.toHaveBeenCalled();
  });

  it("tells a tab when its sound changes, and nothing else", async () => {
    const chrome = await load();

    chrome.tabs.onUpdated.fire(4, { title: "Meet" });
    chrome.tabs.onUpdated.fire(4, { mutedInfo: { muted: true } });

    expect(chrome.tabs.sendMessage).toHaveBeenCalledExactlyOnceWith(4, {
      type: "mute-changed",
      muted: true,
    });
  });
});

export {};
