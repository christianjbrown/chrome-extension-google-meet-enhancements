import { SoundChangeRouter } from "../../src/window-mute/sound-change-router";

describe("SoundChangeRouter", () => {
  it("tells a tab when its sound changes, and nothing else", () => {
    const teller = { tell: vi.fn() };
    const router = new SoundChangeRouter(teller);

    router.onTabUpdated(4, {});
    router.onTabUpdated(4, { mutedInfo: { muted: true } });

    expect(teller.tell).toHaveBeenCalledExactlyOnceWith(4, true);
  });
});
