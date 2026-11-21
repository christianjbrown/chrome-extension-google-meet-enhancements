import { ReportMute } from "../../src/window-mute/report-mute";

describe("ReportMute", () => {
  it("reports a tab's sound as it is", async () => {
    await expect(
      new ReportMute().handle({ tabId: 7, muted: true }),
    ).resolves.toBe(true);
    await expect(
      new ReportMute().handle({ tabId: 7, muted: false }),
    ).resolves.toBe(false);
  });
});
