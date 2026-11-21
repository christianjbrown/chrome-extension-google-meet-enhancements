// Tells when Meet moves to another meeting without reloading.
export interface MeetingChanges {
  onChange(listener: () => void): void;
}
