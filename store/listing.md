# Chrome Web Store listing

Everything the developer dashboard asks for, ready to paste. The images are in this folder.

## Package

Run `npm run package` and upload the `extension.zip` it makes. Bump `version` in `static/manifest.json` before uploading an update.

## Store listing

- **Name:** Christian's Google Meet Enhancements (read from the manifest)
- **Summary:** Small fixes for Google Meet. Mute one meeting's sound without touching the others, and join every meeting with camera and mic off. (read from the manifest)
- **Category:** Productivity > Communication
- **Language:** English (United Kingdom)
- **Store icon:** `icon-128.png`
- **Screenshots:** `screenshot-1280x800.png`, then `screenshot-2-1280x800.png`
- **Small promo tile:** `promo-440x280.png`
- **Homepage URL:** https://github.com/christianjbrown/chrome-extension-google-meet-enhancements
- **Support URL:** https://github.com/christianjbrown/chrome-extension-google-meet-enhancements/issues

**Description**

```text
Small fixes for the bits of Google Meet that get in the way. No settings, no toolbar button: it just quietly makes Meet nicer, and more fixes will join these over time.

Mute one meeting, not all of them
• A speaker button at the top of every meeting silences what that meeting window plays, and only that one. In two meetings at once? Listen to one and park the other.
• Works in Meet's app window and pop-out too, which have no tab strip to right-click.
• Grey while you can hear it, red while you can't, so a parked meeting is hard to miss.
• It only changes what you hear. Your microphone and camera are left exactly as they were.
• Keeps up with Chrome: mute the tab some other way and the button changes to match.

Join with your camera and mic off
• Meet sometimes switches your camera and mic on for you in the pre-join screen. This switches them off before you join.
• The moment you click or press a key, it backs off, so turning your mic back on before joining sticks.
• It presses Meet's own buttons, so Meet always knows the real state.
• Every meeting starts quiet, even when you move to the next one without reloading.

No tracking, no accounts, no permissions to grant, and nothing sent anywhere. It only runs on meet.google.com.
```

## Privacy practices

**Single purpose**

```text
Small usability fixes for the Google Meet meeting page: muting the sound of a single meeting window, and starting meetings with the camera and microphone off.
```

**Permission justifications**

The manifest asks for no permissions. If the dashboard asks about host access for the content script on meet.google.com:

```text
The content script runs only on meet.google.com, where it adds a button that mutes the sound of that meeting's tab and switches the camera and microphone off in the pre-join screen by pressing Meet's own buttons. It reads nothing else and sends nothing anywhere.
```

**Remote code:** No, I am not using remote code.

**Data usage:** tick none of the data types, then tick all three certifications.

**Privacy policy URL:** https://github.com/christianjbrown/chrome-extension-google-meet-enhancements/blob/main/PRIVACY.md

## Distribution

Free, public, all regions.
