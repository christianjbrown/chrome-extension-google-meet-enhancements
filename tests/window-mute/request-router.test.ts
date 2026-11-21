import type { MuteRequest } from "../../src/window-mute/messages";
import { RequestRouter } from "../../src/window-mute/request-router";

// Accepts every message, or none, and keeps what it was asked about.
function fakeRequests(known: boolean) {
  const seen: unknown[] = [];
  return {
    seen,
    accepts: (message: unknown): message is MuteRequest => {
      seen.push(message);
      return known;
    },
  };
}

function setup(known = true) {
  const answerer = { answer: vi.fn().mockResolvedValue({ muted: true }) };
  const requests = fakeRequests(known);
  return { answerer, requests, router: new RequestRouter(answerer, requests) };
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

  it("ignores a message that is not a request it knows", () => {
    const { answerer, requests, router } = setup(false);

    const keepOpen = router.onMessage(
      { type: "something-else" },
      { tab: { id: 4 } },
      vi.fn(),
    );

    expect(keepOpen).toBe(false);
    expect(requests.seen).toEqual([{ type: "something-else" }]);
    expect(answerer.answer).not.toHaveBeenCalled();
  });
});
