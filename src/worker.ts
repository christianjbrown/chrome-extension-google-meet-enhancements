// The service worker: hooks chrome's events up to the routers.
import { KnownRequests } from "./window-mute/known-requests";
import type { MuteRequestHandlers } from "./window-mute/mute-request-handler";
import { ReportMute } from "./window-mute/report-mute";
import { RequestRouter } from "./window-mute/request-router";
import { SoundChangeRouter } from "./window-mute/sound-change-router";
import { STATE_REQUEST } from "./window-mute/state-request";
import { TabMuter } from "./window-mute/tab-muter";
import { TabTeller } from "./window-mute/tab-teller";
import { ToggleMute } from "./window-mute/toggle-mute";
import { TOGGLE_REQUEST } from "./window-mute/toggle-request";

const handlers = {
  [STATE_REQUEST]: new ReportMute(),
  [TOGGLE_REQUEST]: new ToggleMute(chrome.tabs),
} satisfies MuteRequestHandlers;

const requests = new RequestRouter(
  new TabMuter(chrome.tabs, handlers),
  new KnownRequests(handlers),
);
const soundChanges = new SoundChangeRouter(new TabTeller(chrome.tabs));

chrome.runtime.onMessage.addListener((message: unknown, sender, respond) =>
  requests.onMessage(message, sender, respond),
);

chrome.tabs.onUpdated.addListener((tabId, change) => {
  soundChanges.onTabUpdated(tabId, change);
});
