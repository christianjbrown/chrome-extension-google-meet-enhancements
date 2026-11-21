// Watches the page through a MutationObserver, for every node added and every
// element whose watched attributes change.
import type { Watcher } from "./watcher";

// The record type a MutationObserver gives an attribute change.
const ATTRIBUTE_CHANGE: MutationRecordType = "attributes";

export type ObserverFactory = (callback: MutationCallback) => MutationObserver;

// The element whose attribute changed, then every node the record added.
function report(record: MutationRecord, changed: (node: Node) => void): void {
  if (record.type === ATTRIBUTE_CHANGE) changed(record.target);
  record.addedNodes.forEach((node) => {
    changed(node);
  });
}

export class NodeWatcher implements Watcher {
  constructor(
    private readonly observe: ObserverFactory,
    private readonly root: Node,
    private readonly attributes: readonly string[],
  ) {}

  watch(changed: (node: Node) => void): () => void {
    const observer = this.observe((records) => {
      records.forEach((record) => {
        report(record, changed);
      });
    });
    observer.observe(this.root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [...this.attributes],
    });
    return () => {
      observer.disconnect();
    };
  }
}
