import { KnownRequests } from "../../src/window-mute/known-requests";

const requests = new KnownRequests({
  "mute-state": "state handler",
  "toggle-mute": "toggle handler",
});

describe("KnownRequests", () => {
  it.each(["mute-state", "toggle-mute"])("accepts a %s request", (type) => {
    expect(requests.accepts({ type })).toBe(true);
  });

  it.each([
    ["nothing", undefined],
    ["a string", "toggle-mute"],
    ["a request with no type", {}],
    ["a type that is not text", { type: 7 }],
    ["a type nobody handles", { type: "something-else" }],
    ["an inherited name", { type: "toString" }],
  ])("rejects %s", (_name, message) => {
    expect(requests.accepts(message)).toBe(false);
  });
});
