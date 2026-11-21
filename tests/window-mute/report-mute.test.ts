import { ReportMute } from "../../src/window-mute/report-mute";

describe("ReportMute", () => {
  it("reports a tab's sound as it is", async () => {
    await expect(new ReportMute().handle(7, true)).resolves.toBe(true);
    await expect(new ReportMute().handle(7, false)).resolves.toBe(false);
  });
});
