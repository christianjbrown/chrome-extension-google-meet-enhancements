// The service worker: hooks chrome's events up to the routers.
import { MUTE_REQUEST } from "./window-mute/messages";
import type { MuteRequest } from "./window-mute/messages";
import type { MuteRequestHandlers } from "./window-mute/mute-request-handler";
import { ReportMute } from "./window-mute/report-mute";
import { RequestRouter } from "./window-mute/request-router";
import { SoundChangeRouter } from "./window-mute/sound-change-router";
import { TabMuter } from "./window-mute/tab-muter";
import { TabTeller } from "./window-mute/tab-teller";
import { ToggleMute } from "./window-mute/toggle-mute";

const handlers = {
  [MUTE_REQUEST.state]: new ReportMute(),
  [MUTE_REQUEST.toggle]: new ToggleMute(chrome.tabs),
} satisfies MuteRequestHandlers;

const requests = new RequestRouter(new TabMuter(chrome.tabs, handlers));
const soundChanges = new SoundChangeRouter(new TabTeller(chrome.tabs));

chrome.runtime.onMessage.addListener((request: MuteRequest, sender, respond) =>
  requests.onMessage(request, sender, respond),
);

chrome.tabs.onUpdated.addListener((tabId, change) => {
  soundChanges.onTabUpdated(tabId, change);
});
