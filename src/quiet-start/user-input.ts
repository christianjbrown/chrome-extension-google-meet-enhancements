// Tells when you click or press a key.
export interface UserInput {
  onPress(listener: () => void): void;
}
