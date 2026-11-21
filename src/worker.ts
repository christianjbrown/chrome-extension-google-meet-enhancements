// The service worker: hooks chrome's events up to the router.
import type { MuteRequest } from "./window-mute/messages";
import { TabMuter } from "./window-mute/tab-muter";
import { TabTeller } from "./window-mute/tab-teller";
import { WorkerRouter } from "./window-mute/worker-router";

const router = new WorkerRouter(
  new TabMuter(chrome.tabs),
  new TabTeller(chrome.tabs),
);

chrome.runtime.onMessage.addListener((request: MuteRequest, sender, respond) =>
  router.onMessage(request, sender, respond),
);

chrome.tabs.onUpdated.addListener((tabId, change) => {
  router.onTabUpdated(tabId, change);
});
