// Tells when Meet moves to another meeting without reloading. Joining the same
// meeting is not a new one.
import { NAVIGATE_SUCCESS } from "../event-source";
import type { EventSource } from "../event-source";

// Where Meet is, and when it moves. main.ts hands over the window's navigation.
export interface Navigation extends EventSource {
  readonly currentEntry: { readonly url: string | null } | null;
}

export interface MeetingChanges {
  onChange(listener: () => void): void;
}

export class NavigationMeetings implements MeetingChanges {
  constructor(private readonly navigation: Navigation) {}

  onChange(listener: () => void): void {
    let address = this.meeting();
    this.navigation.addEventListener(NAVIGATE_SUCCESS, () => {
      if (this.meeting() === address) return;
      address = this.meeting();
      listener();
    });
  }

  // The path alone, so Meet adding ?authuser= or similar is not a new meeting.
  private meeting(): string | undefined {
    const url = this.navigation.currentEntry?.url;
    return url ? new URL(url).pathname : undefined;
  }
}
