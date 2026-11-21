import { WorkerRouter } from "../../src/window-mute/worker-router";

function setup() {
  const muter = {
    answer: vi.fn().mockResolvedValue({ muted: true }),
    tell: vi.fn(),
  };
  return { muter, router: new WorkerRouter(muter) };
}

describe("WorkerRouter", () => {
  it("answers the tab that asked, and keeps the reply channel open", async () => {
    const { muter, router } = setup();
    const respond = vi.fn();

    const keepOpen = router.onMessage(
      { type: "toggle-mute" },
      { tab: { id: 4 } },
      respond,
    );

    expect(keepOpen).toBe(true);
    await vi.waitFor(() => {
      expect(respond).toHaveBeenCalledWith({ muted: true });
    });
    expect(muter.answer).toHaveBeenCalledWith({ type: "toggle-mute" }, 4);
  });

  it("answers with nothing when the tab cannot be read", async () => {
    const { muter, router } = setup();
    muter.answer.mockRejectedValue(new Error("No tab with id: 4"));
    const respond = vi.fn();

    router.onMessage({ type: "mute-state" }, { tab: { id: 4 } }, respond);

    await vi.waitFor(() => {
      expect(respond).toHaveBeenCalledWith(undefined);
    });
  });

  it("ignores messages that do not come from a tab", () => {
    const { muter, router } = setup();

    const keepOpen = router.onMessage({ type: "toggle-mute" }, {}, vi.fn());

    expect(keepOpen).toBe(false);
    expect(muter.answer).not.toHaveBeenCalled();
  });

  it("tells a tab when its sound changes, and nothing else", () => {
    const { muter, router } = setup();

    router.onTabUpdated(4, {});
    router.onTabUpdated(4, { mutedInfo: { muted: true } });

    expect(muter.tell).toHaveBeenCalledExactlyOnceWith(4, true);
  });
});
