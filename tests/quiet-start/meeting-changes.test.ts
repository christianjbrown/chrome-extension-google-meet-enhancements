import { NavigationMeetings } from "../../src/quiet-start/meeting-changes";

function setup(url: string | null = "https://meet.google.com/abc-defg-hij") {
  const navigation: EventTarget & {
    currentEntry: { url: string | null } | null;
  } = Object.assign(new EventTarget(), { currentEntry: { url } });
  const listener = vi.fn();
  new NavigationMeetings(navigation).onChange(listener);
  return {
    listener,
    moveTo: (next: string | null) => {
      navigation.currentEntry = next === null ? null : { url: next };
      navigation.dispatchEvent(new Event("navigatesuccess"));
    },
  };
}

describe("NavigationMeetings", () => {
  it("reports a different meeting", () => {
    const { listener, moveTo } = setup();

    moveTo("https://meet.google.com/xyz-abcd-efg");

    expect(listener).toHaveBeenCalledOnce();
  });

  it("leaves the same meeting alone when only the query changes", () => {
    const { listener, moveTo } = setup();

    moveTo("https://meet.google.com/abc-defg-hij?authuser=1");

    expect(listener).not.toHaveBeenCalled();
  });

  it("copes with Meet not saying where it is", () => {
    const { listener, moveTo } = setup(null);

    moveTo(null);
    expect(listener).not.toHaveBeenCalled();

    moveTo("https://meet.google.com/abc-defg-hij");
    expect(listener).toHaveBeenCalledOnce();
  });
});
