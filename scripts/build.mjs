// Bundles the content script and the service worker, and copies the static
// files into dist/, which is the folder Chrome loads with "Load unpacked".
// The bundle names and the browser target come from the manifest, so the
// manifest is the one place that says what the extension is.
import { build } from "esbuild";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { basename } from "node:path";

const OUTPUT_DIR = "dist";
const STATIC_DIR = "static";
const MANIFEST_PATH = `${STATIC_DIR}/manifest.json`;
const CONTENT_SOURCE = "src/main.ts";
const WORKER_SOURCE = "src/worker.ts";
const BUNDLE_EXTENSION = ".js";

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const bundleName = (file) => basename(file, BUNDLE_EXTENSION);

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
await build({
  entryPoints: {
    [bundleName(manifest.content_scripts[0].js[0])]: CONTENT_SOURCE,
    [bundleName(manifest.background.service_worker)]: WORKER_SOURCE,
  },
  outdir: OUTPUT_DIR,
  bundle: true,
  format: "iife",
  target: `chrome${manifest.minimum_chrome_version}`,
  minify: false,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});
await cp(STATIC_DIR, OUTPUT_DIR, { recursive: true });
