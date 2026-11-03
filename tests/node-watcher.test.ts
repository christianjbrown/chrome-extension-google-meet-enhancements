import { NodeWatcher } from "../src/node-watcher";

function watch(root: Node) {
  const changed = vi.fn();
  const stop = new NodeWatcher(
    (callback) => new MutationObserver(callback),
    root,
    ["data-is-muted"],
  ).watch(changed);
  return { changed, stop };
}

describe("NodeWatcher", () => {
  it("reports nodes added anywhere below the root", async () => {
    const root = document.createElement("div");
    root.append(document.createElement("section"));
    const { changed } = watch(root);
    const button = document.createElement("button");

    root.firstElementChild!.append(button);

    await vi.waitFor(() => {
      expect(changed).toHaveBeenCalledWith(button);
    });
  });

  it("reports an element whose watched attribute changes", async () => {
    const root = document.createElement("div");
    const button = document.createElement("button");
    root.append(button);
    const { changed } = watch(root);

    button.setAttribute("title", "ignored");
    button.setAttribute("data-is-muted", "false");

    await vi.waitFor(() => {
      expect(changed).toHaveBeenCalledExactlyOnceWith(button);
    });
  });

  it("stops reporting once told to", async () => {
    const root = document.createElement("div");
    const { changed, stop } = watch(root);

    stop();
    root.append(document.createElement("p"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(changed).not.toHaveBeenCalled();
  });
});
