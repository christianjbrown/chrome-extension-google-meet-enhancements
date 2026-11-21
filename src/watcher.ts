// Reports every node Meet adds to the page, and every element whose watched
// attributes change, since it draws the meeting long after the page loads.
// Watching stops when the function it hands back is called.
export interface Watcher {
  watch(changed: (node: Node) => void): () => void;
}
