// The meeting's microphone and camera, which quiet start switches off.
export interface Devices {
  turnOffAll(): void;
  turnOff(node: Node): void;
}
