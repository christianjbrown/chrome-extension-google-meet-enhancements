// Loads the content script into jsdom's page, with a fake chrome and
// navigation, and checks the mute button works through the real wiring.
async function load(path = "/abc-defg-hij") {
  vi.resetModules();
  document.body.innerHTML = "";
  history.replaceState(null, "", path);
  const navigation = Object.assign(new EventTarget(), {
    get currentEntry() {
      return { url: location.href };
    },
  });
  vi.stubGlobal("navigation", navigation);
  let heard: (message: unknown) => void = (_message) => undefined;
  const chrome = {
    runtime: {
      sendMessage: vi.fn((request: { type: string }) =>
        Promise.resolve({ muted: request.type === "toggle-mute" }),
      ),
      onMessage: {
        addListener: (listener: (message: unknown) => void) => {
          heard = listener;
        },
      },
    },
  };
  vi.stubGlobal("chrome", chrome);
  const shadow: { root?: ShadowRoot } = {};
  const attach = HTMLElement.prototype.attachShadow;
  vi.spyOn(HTMLElement.prototype, "attachShadow").mockImplementation(function (
    this: HTMLElement,
    init: ShadowRootInit,
  ) {
    shadow.root = attach.call(this, init);
    return shadow.root;
  });
  await import("../src/main");
  return {
    chrome,
    navigation,
    button: () => shadow.root!.querySelector("button")!,
    tell: (message: unknown) => {
      heard(message);
    },
  };
}

describe("content script", () => {
  it("puts the mute button on a meeting and mutes the tab when pressed", async () => {
    const { chrome, button } = await load();
    expect(document.querySelector("meet-enhancements-mute")).not.toBeNull();

    button().click();

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: "toggle-mute",
    });
    await vi.waitFor(() => {
      expect(button().getAttribute("aria-pressed")).toBe("true");
    });
  });

  it("follows the tab being unmuted from elsewhere", async () => {
    const { button, tell } = await load();
    button().click();
    await vi.waitFor(() => {
      expect(button().getAttribute("aria-pressed")).toBe("true");
    });

    tell({ type: "mute-changed", muted: false });

    expect(button().getAttribute("aria-pressed")).toBe("false");
  });

  it("stays off the landing page until Meet moves into a meeting", async () => {
    const { navigation } = await load("/landing");
    expect(document.querySelector("meet-enhancements-mute")).toBeNull();

    history.pushState(null, "", "/abc-defg-hij");
    navigation.dispatchEvent(new Event("navigatesuccess"));

    expect(document.querySelector("meet-enhancements-mute")).not.toBeNull();
  });

  it("switches off a mic Meet turns on in the pre-join screen", async () => {
    await load();
    const mic = document.createElement("div");
    mic.setAttribute("role", "button");
    // Meet flips the attribute when its button is pressed.
    mic.addEventListener("click", () => {
      mic.setAttribute("data-is-muted", "true");
    });
    mic.setAttribute("data-is-muted", "false");

    document.body.append(mic);

    await vi.waitFor(() => {
      expect(mic.getAttribute("data-is-muted")).toBe("true");
    });
  });
});

export {};
