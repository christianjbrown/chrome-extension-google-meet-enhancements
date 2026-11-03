import { isMuteChanged } from "../../src/window-mute/messages";

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
