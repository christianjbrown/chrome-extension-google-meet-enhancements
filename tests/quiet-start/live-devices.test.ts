import { LiveDevices } from "../../src/quiet-start/live-devices";

function buttons(html: string) {
  document.body.innerHTML = html;
  const pressed: string[] = [];
  document.querySelectorAll("[id]").forEach((element) => {
    element.addEventListener("click", () => pressed.push(element.id));
  });
  return pressed;
}

describe("LiveDevices", () => {
  it("presses every switched-on mic or camera on the page", () => {
    const pressed = buttons(`
      <div role="button" id="mic" data-is-muted="false"></div>
      <button id="camera" data-is-muted="false"></button>
      <button id="off" data-is-muted="true"></button>
      <span id="not-a-button" data-is-muted="false"></span>
      <button id="other"></button>`);

    new LiveDevices(document).turnOffAll();

    expect(pressed).toEqual(["mic", "camera"]);
  });

  it("presses a button that is itself the changed node", () => {
    const pressed = buttons(
      `<div><button id="camera" data-is-muted="false"></button></div>`,
    );

    new LiveDevices(document).turnOff(document.getElementById("camera")!);

    expect(pressed).toEqual(["camera"]);
  });

  it("ignores nodes that are not elements", () => {
    const pressed = buttons(`<button id="mic" data-is-muted="false"></button>`);

    new LiveDevices(document).turnOff(document.createTextNode("hello"));

    expect(pressed).toEqual([]);
  });
});
