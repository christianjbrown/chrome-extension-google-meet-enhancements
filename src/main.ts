// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import type { Enhancement } from "./enhancement";
import { NodeWatcher } from "./node-watcher";
import { LiveDevices } from "./quiet-start/live-devices";
import { NavigationMeetings } from "./quiet-start/navigation-meetings";
import { PageInput } from "./quiet-start/page-input";
import { QuietStart } from "./quiet-start/quiet-start";
import { ButtonPlacement } from "./window-mute/button-placement";
import { MeetingPage } from "./window-mute/meeting-page";
import { MuteButton } from "./window-mute/mute-button";
import { SoundSync } from "./window-mute/sound-sync";
import { WorkerSwitch } from "./window-mute/worker-switch";

// One button, which one part keeps in step with the sound and another puts on
// meetings only.
function windowMute(): Enhancement[] {
  const button = new MuteButton(document);
  return [
    new SoundSync(button, new WorkerSwitch(chrome.runtime)),
    new ButtonPlacement(new MeetingPage(location), button, navigation),
  ];
}

function quietStart(): Enhancement {
  return new QuietStart(
    new LiveDevices(document),
    new NodeWatcher(
      (callback) => new MutationObserver(callback),
      document,
      LiveDevices.WATCHED_ATTRIBUTES,
    ),
    new PageInput(window),
    new NavigationMeetings(navigation),
  );
}

// A new enhancement is a new class and a new line here.
const enhancements: Enhancement[] = [...windowMute(), quietStart()];

for (const enhancement of enhancements) enhancement.start();
