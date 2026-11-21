import {
  isMuteChanged,
  isMuteState,
  isUntrusted,
} from "../../src/window-mute/message-guards";

describe("isUntrusted", () => {
  it.each([undefined, null, "text", 7])("rejects %s", (value) => {
    expect(isUntrusted(value)).toBe(false);
  });

  it("accepts any object", () => {
    expect(isUntrusted({})).toBe(true);
  });
});

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

describe("isMuteState", () => {
  it.each([true, false])("accepts a sound of muted %s", (muted) => {
    expect(isMuteState({ muted })).toBe(true);
  });

  it.each([
    ["nothing", undefined],
    ["null", null],
    ["an answer with no state", {}],
    ["a state that is not a boolean", { muted: "yes" }],
  ])("rejects %s", (_name, answer) => {
    expect(isMuteState(answer)).toBe(false);
  });
});
