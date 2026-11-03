import { WorkerSwitch } from "../../src/window-mute/worker-switch";

function fakeRuntime(answer: { muted: boolean } | undefined) {
  let heard: (message: unknown) => void = (_message) => undefined;
  return {
    sendMessage: vi.fn().mockResolvedValue(answer),
    onMessage: {
      addListener: (listener: (message: unknown) => void) => {
        heard = listener;
      },
    },
    send: (message: unknown) => {
      heard(message);
    },
  };
}

describe("WorkerSwitch", () => {
  it("asks for the tab's sound", async () => {
    const runtime = fakeRuntime({ muted: true });

    await expect(new WorkerSwitch(runtime).state()).resolves.toBe(true);
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "mute-state" });
  });

  it("asks for the tab to be flipped, and reports the result", async () => {
    const runtime = fakeRuntime({ muted: false });

    await expect(new WorkerSwitch(runtime).toggle()).resolves.toBe(false);
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "toggle-mute" });
  });

  it("fails when the service worker could not answer", async () => {
    await expect(
      new WorkerSwitch(fakeRuntime(undefined)).state(),
    ).rejects.toThrow("No answer");
  });

  it("passes on mute changes and ignores other messages", () => {
    const runtime = fakeRuntime({ muted: false });
    const listener = vi.fn();
    new WorkerSwitch(runtime).onChange(listener);

    runtime.send({ type: "something-else" });
    runtime.send({ type: "mute-changed", muted: true });

    expect(listener).toHaveBeenCalledExactlyOnceWith(true);
  });
});
