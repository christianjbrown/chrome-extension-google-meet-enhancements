// The tab's sound as the page sees it: whether it is muted, a way to flip it,
// and word whenever it changes.
export interface Switch {
  state(): Promise<boolean>;
  toggle(): Promise<boolean>;
  onChange(listener: (muted: boolean) => void): void;
}
