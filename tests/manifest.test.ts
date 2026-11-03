import manifestJson from "../static/manifest.json";

describe("manifest", () => {
  it("runs the content script only on Google Meet", () => {
    expect(manifestJson.content_scripts).toEqual([
      {
        matches: ["https://meet.google.com/*"],
        js: ["content.js"],
        run_at: "document_idle",
      },
    ]);
  });

  // The Chrome Web Store shows it as the listing's summary and refuses an
  // upload whose description is longer.
  it("has a description short enough for the Web Store summary", () => {
    expect(manifestJson.description.length).toBeLessThanOrEqual(132);
  });

  it("has a service worker, which is what can mute a tab", () => {
    expect(manifestJson.background).toEqual({
      service_worker: "background.js",
    });
  });

  // chrome.tabs.update({ muted }) and tabs.onUpdated's mutedInfo need no
  // permission. Only a tab's URL, title and favicon are behind "tabs".
  it("asks for no permissions or host access", () => {
    expect(manifestJson).not.toHaveProperty("permissions");
    expect(manifestJson).not.toHaveProperty("host_permissions");
    expect(manifestJson).not.toHaveProperty("optional_permissions");
  });

  it("has no toolbar button, options page or keyboard shortcut", () => {
    expect(manifestJson).not.toHaveProperty("action");
    expect(manifestJson).not.toHaveProperty("options_page");
    expect(manifestJson).not.toHaveProperty("options_ui");
    expect(manifestJson).not.toHaveProperty("commands");
  });
});
