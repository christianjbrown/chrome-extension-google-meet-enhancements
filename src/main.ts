// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import type { Enhancement } from "./enhancement";
import { NodeWatcher } from "./node-watcher";
import { LiveDevices } from "./quiet-start/live-devices";
import { QuietStart } from "./quiet-start/quiet-start";
import { MeetingPage } from "./window-mute/meeting-page";
import { MuteButton } from "./window-mute/mute-button";
import { WindowMute } from "./window-mute/window-mute";
import { WorkerSwitch } from "./window-mute/worker-switch";

function windowMute(): Enhancement {
  return new WindowMute(
    new MeetingPage(location),
    new MuteButton(document),
    new WorkerSwitch(chrome.runtime),
    navigation,
  );
}

function quietStart(): Enhancement {
  return new QuietStart(
    new LiveDevices(document),
    new NodeWatcher((callback) => new MutationObserver(callback), document, [
      "data-is-muted",
    ]),
    window,
    navigation,
  );
}

// A new enhancement is a new class and a new line here.
const enhancements: Enhancement[] = [windowMute(), quietStart()];

for (const enhancement of enhancements) enhancement.start();
