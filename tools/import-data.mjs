import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  PAGE_DIR,
  DEFAULT_SOURCE_URLS,
  readJson,
  readRemoteJson,
  buildMaster,
  writeOutputs,
} from "./build-master.mjs";

const __filename = fileURLToPath(import.meta.url);

const DIST_DIR = path.join(PAGE_DIR, "dist");
const DIST_DATA_DIR = path.join(DIST_DIR, "data");
const SOURCES_DIR = path.join(PAGE_DIR, "sources");

const SOURCE_URLS = {
  items: DEFAULT_SOURCE_URLS.items,
  cosmetics: DEFAULT_SOURCE_URLS.cosmetics,
  vanity: process.env.SOURCE_VANITY_URL || "",
  locations: process.env.SOURCE_LOCATIONS_URL || "",
};

const LOCAL_FALLBACKS = {
  vanity: path.join(SOURCES_DIR, "vanity.json"),
  locations: path.join(SOURCES_DIR, "locations.json"),
};

const STATIC_FILES = ["index.html", "app.js", "styles.css", "data-utils.js", "README.md", "LICENSE"];

async function fetchWithOptionalLocalFallback(url, fallbackPath, label) {
  if (url) {
    try {
      return await readRemoteJson(url);
    } catch {
    }
  }
  try {
    return await readJson(fallbackPath);
  } catch {
    console.warn(`[import] ${label}: no source URL or local fallback found, using empty dataset`);
    return {};
  }
}

async function copyStaticFilesToDist() {
  await fs.mkdir(DIST_DIR, { recursive: true });
  await Promise.all(
    STATIC_FILES.map(async (fileName) => {
      const from = path.join(PAGE_DIR, fileName);
      const to = path.join(DIST_DIR, fileName);
      await fs.copyFile(from, to);
    })
  );
}

async function main() {
  const [items, cosmetics, vanity, locations] = await Promise.all([
    readRemoteJson(SOURCE_URLS.items),
    readRemoteJson(SOURCE_URLS.cosmetics),
    fetchWithOptionalLocalFallback(SOURCE_URLS.vanity, LOCAL_FALLBACKS.vanity, "vanity index"),
    fetchWithOptionalLocalFallback(SOURCE_URLS.locations, LOCAL_FALLBACKS.locations, "locations"),
  ]);

  const data = buildMaster({ items, cosmetics, vanity, locations });
  await writeOutputs(data, DIST_DATA_DIR, { writeWrappers: true });
  await copyStaticFilesToDist();

  const hasHardErrors = data.summary.duplicates > 0 || data.summary.missingSlot > 0;
  console.log(
    `[import] items=${data.summary.items} unmatchedLocations=${data.summary.unmatchedLocations} unmatchedVanity=${data.summary.unmatchedVanity} duplicates=${data.summary.duplicates} missingSlot=${data.summary.missingSlot}`
  );

  if (hasHardErrors) {
    process.exitCode = 2;
  }
}

if (path.resolve(process.argv[1] || "") === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
