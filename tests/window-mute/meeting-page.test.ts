import { MeetingPage } from "../../src/window-mute/meeting-page";

describe("MeetingPage", () => {
  it.each(["/abc-defg-hij", "/abc-defg-hij/", "/_meet/abc-defg-hij"])(
    "counts %s as a meeting",
    (pathname) => {
      expect(new MeetingPage({ pathname }).isMeeting()).toBe(true);
    },
  );

  it.each(["/", "/landing", "/abc-defg-hijk", "/new"])(
    "does not count %s",
    (pathname) => {
      expect(new MeetingPage({ pathname }).isMeeting()).toBe(false);
    },
  );
});
