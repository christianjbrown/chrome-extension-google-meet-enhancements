// Says whether the page is a meeting, from its address. Meet's landing page,
// settings and the like have no meeting code in the path.
export interface Page {
  isMeeting(): boolean;
}

const meetingCode = /\/[a-z]{3}-[a-z]{4}-[a-z]{3}(?:\/|$)/;

export class MeetingPage implements Page {
  constructor(private readonly location: { pathname: string }) {}

  isMeeting(): boolean {
    return meetingCode.test(this.location.pathname);
  }
}
