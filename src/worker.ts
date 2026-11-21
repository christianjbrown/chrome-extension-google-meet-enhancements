// The service worker: hooks chrome's events up to the router.
import { MUTE_REQUEST } from "./window-mute/messages";
import type { MuteRequest } from "./window-mute/messages";
import type { MuteRequestHandlers } from "./window-mute/mute-request-handler";
import { ReportMute } from "./window-mute/report-mute";
import { TabMuter } from "./window-mute/tab-muter";
import { TabTeller } from "./window-mute/tab-teller";
import { ToggleMute } from "./window-mute/toggle-mute";
import { WorkerRouter } from "./window-mute/worker-router";

const handlers = {
  [MUTE_REQUEST.state]: new ReportMute(),
  [MUTE_REQUEST.toggle]: new ToggleMute(chrome.tabs),
} satisfies MuteRequestHandlers;

const router = new WorkerRouter(
  new TabMuter(chrome.tabs, handlers),
  new TabTeller(chrome.tabs),
);

chrome.runtime.onMessage.addListener((request: MuteRequest, sender, respond) =>
  router.onMessage(request, sender, respond),
);

chrome.tabs.onUpdated.addListener((tabId, change) => {
  router.onTabUpdated(tabId, change);
});
