// Somewhere page events can be heard from. main.ts hands over the window and
// its navigation.
export interface EventSource {
  addEventListener(
    type: string,
    listener: (event: Event) => void,
    options?: AddEventListenerOptions,
  ): void;
}
