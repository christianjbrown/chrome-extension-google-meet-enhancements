# Google Meet Enhancements Chrome Extension 🎧

A little Chrome extension that smooths out the bits of Google Meet that bug me. Right now that's two things, and it's built to collect more. No options page, no toolbar button, no settings. It just quietly makes Meet nicer.

## Enhancements ✨

- **Mute one meeting's sound.** A speaker button at the top of every meeting silences what that meeting window plays, and only that one. Sat in two meetings at once? Listen to one and park the other. 🔇
- **Start every meeting with your camera and mic off.** No more joining a call mid-sentence or mid-sandwich. You switch them on when you're ready. 🤐

## What the mute button does 🔈

Chrome can mute a tab, but only from the tab strip, and Meet's app window and pop-out have no tab strip to right-click. "Mute site" is no good either, because it mutes every Meet window at once. This puts the button in the meeting itself:

- **It mutes the window, not the site.** Under the hood each Meet window is still a Chrome tab, and the button mutes just that tab. Every other meeting keeps playing.
- **It's only what you hear.** Your microphone and camera are untouched, so people can still hear you if your mic is on. Meet's own mic button is still the one for that.
- **Grey means you can hear it, red means you can't.** Red with a struck-through speaker, same as Meet's mic button when it's off. Chrome's own muted-speaker icon shows up in the window title too.
- **It keeps up with Chrome.** Mute or unmute the tab some other way (right-click a tab, another extension) and the button changes to match.
- **It sticks across a reload.** Chrome remembers a tab is muted, so reloading the meeting keeps it muted.

What it leaves alone 🙅:

- **Pages that aren't a meeting.** The button only shows on a meeting address like `meet.google.com/abc-defg-hij`, not the landing page or settings. It appears by itself when Meet moves you into a meeting.

## What quiet start does 🤫

Meet remembers whether your camera and mic were on last time, and sometimes switches them on for you in the pre-join screen. This turns them off before you join:

- **Anything on before you touch anything goes off.** Until you first click or press a key in the meeting, whatever's on is Meet's idea, not yours, so it gets switched off. That includes a camera that only wakes up a few seconds in.
- **Your first click or key press, and it backs off.** Turn your mic back on in the pre-join screen and it stays on. Joining always takes a click or Enter, so it never touches anything once you're in the call.
- **Meet's own buttons do the switching.** It presses the same mic and camera buttons you would, so Meet always knows the real state.
- **Every meeting starts fresh.** Move to a different meeting without reloading and that one starts quiet too.

## Install it 🔧

You need [Node.js](https://nodejs.org) 22 or newer, and Chrome 126 or newer.

1. Grab the code and build it:

   ```bash
   git clone https://github.com/christianjbrown/chrome-extension-google-meet-enhancements.git
   cd chrome-extension-google-meet-enhancements
   npm ci
   npm run build
   ```

   That makes a `dist` folder, which is the actual extension.

2. Open `chrome://extensions` in Chrome.
3. Flip on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `dist` folder.
5. Reload any Meet window you already had open.

### Updating 🔄

```bash
git pull
npm ci
npm run build
```

Then hit the reload arrow on the Christian's Google Meet Enhancements card in `chrome://extensions`, and reload Meet.

## Good to know 🤓

- **It asks for no permissions.** Muting a tab doesn't need any, so the content script only runs on `meet.google.com` and Chrome will say it can read and change your data there, and that's the whole list.
- **Muted means muted.** It's easy to forget a meeting is parked, so the button goes properly red rather than subtly grey. If someone's asking you a question and you can't hear them, look up. 👀
- **Meet's chimes go quiet too.** Join sounds and chat pings come out of the same tab, so a muted meeting is silent all round. Which is probably what you wanted anyway.
- **Clicked straight away?** If you click in the pre-join screen before the camera has finished waking up, quiet start has already backed off, so a late camera stays on. Check the preview before you join.
- **Reloaded the extension mid-meeting?** The button in an already-open meeting can't reach the new copy until you reload that Meet window.

## No tracking 🔒

No analytics, no tracking, no ads, no accounts, and nothing phoning home. It never talks to the internet at all. It reads the page address to decide whether to show the button, asks Chrome to mute or unmute the tab, and presses Meet's own mic and camera buttons, and that's it.

## Development 🛠️

It's TypeScript, bundled with esbuild, tested with Vitest.

```bash
npm test          # the unit tests
npm run ci        # everything CI checks: format, lint, types, unused code, 100% coverage, build
```

`npm run ci` is exactly what CI runs, and coverage has to stay at 100% for lines, branches, functions and statements, or it fails. To run it before every push, point git at the committed hook: `git config core.hooksPath .githooks`.

How it fits together, all in `src`:

- **`main.ts`** is the content script. It builds every enhancement and starts it, and is the only page-side file that touches `document`, `window`, `location`, `navigation`, `MutationObserver` or `chrome`.
- **`worker.ts`** is the service worker. Only it can mute a tab, so it answers the page's requests and tells the page when its tab's sound changes.
- **`enhancement.ts`** is the one-method interface every enhancement implements.
- **`node-watcher.ts`** reports nodes Meet adds and elements whose watched attributes change, until told to stop.
- **`window-mute/`** is the first enhancement:
  - **`window-mute.ts`** shows the button on meetings, flips the sound when it's pressed, and keeps it in step.
  - **`mute-button.ts`** draws the button in its own shadow root, so Meet's styles can't touch it.
  - **`meeting-page.ts`** says whether the address is a meeting.
  - **`worker-switch.ts`** is the page's side of the conversation with the service worker.
  - **`tab-muter.ts`** is the service worker's side: reads, flips and announces a tab's mute state.
  - **`messages.ts`** is what the two sides say to each other.
- **`quiet-start/`** starts meetings with the camera and mic off:
  - **`quiet-start.ts`** switches things off until your first click or key, and starts again in a new meeting.
  - **`live-devices.ts`** finds Meet's mic and camera buttons marked `data-is-muted="false"` and presses them.

Every class gets its collaborators through its constructor, behind an interface, so each one is tested on its own with fakes. Adding the next enhancement means a new class and one more line in the list in `main.ts`. 🧩

## Licence 📄

MIT. See [LICENSE](LICENSE).
