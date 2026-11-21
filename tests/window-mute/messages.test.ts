import {
  isMuteChanged,
  MUTE_CHANGED,
  MUTE_REQUEST,
} from "../../src/window-mute/messages";

describe("isMuteChanged", () => {
  it("accepts a mute change", () => {
    expect(isMuteChanged({ type: "mute-changed", muted: true })).toBe(true);
  });

  it.each([
    ["nothing", undefined],
    ["null", null],
    ["a string", "mute-changed"],
    ["another message", { type: "something-else", muted: true }],
    ["a change with no state", { type: "mute-changed" }],
  ])("rejects %s", (_name, message) => {
    expect(isMuteChanged(message)).toBe(false);
  });
});

// The service worker and the page are built apart, so these strings are the
// contract between them. Changing one needs a deliberate edit here.
describe("message names", () => {
  it("keeps the wire values the two sides agree on", () => {
    expect(MUTE_REQUEST).toEqual({
      state: "mute-state",
      toggle: "toggle-mute",
    });
    expect(MUTE_CHANGED).toBe("mute-changed");
  });
});
