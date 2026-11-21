// How the mute button looks. Grey while the meeting is audible, red when it
// is muted, like Meet's own mic button.
const TOP = "12px";
const BUTTON_SIZE = "40px";
const BUTTON_PADDING = "8px";
const ICON_SIZE = "24px";
// The largest z-index there is, so Meet's own layers never cover the button.
const TOP_LAYER = "2147483647";
const BASE_BACKGROUND = "#3c4043";
const BASE_COLOUR = "#e3e3e3";
const MUTED_BACKGROUND = "#ea4335";
const MUTED_COLOUR = "#fff";
const FOCUS_RING = "#a8c7fa";
const SHADOW = "0 1px 3px rgb(0 0 0 / 0.4)";
const HOVER_BRIGHTNESS = "1.15";

// The attribute the button carries while the meeting is muted.
export const PRESSED_ATTRIBUTE = "aria-pressed";

export const MUTE_BUTTON_STYLE = `
  button {
    position: fixed;
    top: ${TOP};
    left: 50%;
    transform: translateX(-50%);
    z-index: ${TOP_LAYER};
    width: ${BUTTON_SIZE};
    height: ${BUTTON_SIZE};
    border: none;
    border-radius: 50%;
    padding: ${BUTTON_PADDING};
    background: ${BASE_BACKGROUND};
    color: ${BASE_COLOUR};
    cursor: pointer;
    box-shadow: ${SHADOW};
  }
  button:hover { filter: brightness(${HOVER_BRIGHTNESS}); }
  button:focus-visible { outline: 2px solid ${FOCUS_RING}; outline-offset: 2px; }
  button[${PRESSED_ATTRIBUTE}="true"] { background: ${MUTED_BACKGROUND}; color: ${MUTED_COLOUR}; }
  svg { display: block; width: ${ICON_SIZE}; height: ${ICON_SIZE}; fill: currentColor; }
`;
