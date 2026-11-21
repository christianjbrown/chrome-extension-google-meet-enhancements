import { ButtonPlacement } from "../../src/window-mute/button-placement";

function setup(meeting = true) {
  let navigated = () => undefined as unknown;
  const page = { isMeeting: vi.fn(() => meeting) };
  const button = { show: vi.fn(), hide: vi.fn() };
  const navigation = {
    addEventListener: vi.fn((_type: string, listener: () => void) => {
      navigated = listener;
    }),
  };
  new ButtonPlacement(page, button, navigation).start();
  return { page, button, navigation, navigated: () => navigated() };
}

describe("ButtonPlacement", () => {
  it("shows the button on a meeting", () => {
    const { button } = setup();

    expect(button.show).toHaveBeenCalled();
    expect(button.hide).not.toHaveBeenCalled();
  });

  it("keeps the button off pages that are not meetings", () => {
    const { button } = setup(false);

    expect(button.hide).toHaveBeenCalled();
    expect(button.show).not.toHaveBeenCalled();
  });

  it("checks again after Meet moves to another page", () => {
    const { page, button, navigation, navigated } = setup();
    expect(navigation.addEventListener).toHaveBeenCalledWith(
      "navigatesuccess",
      expect.any(Function),
    );
    page.isMeeting.mockReturnValue(false);

    navigated();

    expect(button.hide).toHaveBeenCalled();
  });
});
