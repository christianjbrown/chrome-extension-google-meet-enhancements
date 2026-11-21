import { RequestRouter } from "../../src/window-mute/request-router";

function setup() {
  const answerer = { answer: vi.fn().mockResolvedValue({ muted: true }) };
  return { answerer, router: new RequestRouter(answerer) };
}

describe("RequestRouter", () => {
  it("answers the tab that asked, and keeps the reply channel open", async () => {
    const { answerer, router } = setup();
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
    expect(answerer.answer).toHaveBeenCalledWith({ type: "toggle-mute" }, 4);
  });

  it("answers with nothing when the tab cannot be read", async () => {
    const { answerer, router } = setup();
    answerer.answer.mockRejectedValue(new Error("No tab with id: 4"));
    const respond = vi.fn();

    router.onMessage({ type: "mute-state" }, { tab: { id: 4 } }, respond);

    await vi.waitFor(() => {
      expect(respond).toHaveBeenCalledWith(undefined);
    });
  });

  it("ignores messages that do not come from a tab", () => {
    const { answerer, router } = setup();

    const keepOpen = router.onMessage({ type: "toggle-mute" }, {}, vi.fn());

    expect(keepOpen).toBe(false);
    expect(answerer.answer).not.toHaveBeenCalled();
  });
});
