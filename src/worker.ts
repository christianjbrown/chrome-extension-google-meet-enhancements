// The service worker: mutes the tab a Meet page asks about, and tells the page
// whenever its tab's sound changes.
import type { MuteRequest } from "./window-mute/messages";
import { TabMuter } from "./window-mute/tab-muter";

const muter = new TabMuter(chrome.tabs);

chrome.runtime.onMessage.addListener(
  (request: MuteRequest, sender, respond) => {
    const tabId = sender.tab?.id;
    if (tabId === undefined) return false;
    muter.answer(request, tabId).then(respond, () => {
      respond(undefined);
    });
    // Keeps the reply channel open until the answer arrives.
    return true;
  },
);

chrome.tabs.onUpdated.addListener((tabId, change) => {
  if (change.mutedInfo) muter.tell(tabId, change.mutedInfo.muted);
});
