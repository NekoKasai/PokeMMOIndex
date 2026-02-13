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
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(PAGE_DIR, "dist");
const DIST_DATA_DIR = path.join(DIST_DIR, "data");

const SOURCE_URLS = {
  items: DEFAULT_SOURCE_URLS.items,
  cosmetics: DEFAULT_SOURCE_URLS.cosmetics,
  vanity: "https://raw.githubusercontent.com/NekoKasai/PokeMMOHelper/main/buyable-from-vanity-index.json",
  locations: "https://raw.githubusercontent.com/NekoKasai/PokeMMOHelper/main/cosmetic-locations.json",
};

const LOCAL_FALLBACKS = {
  vanity: path.join(PAGE_DIR, "buyable-from-vanity-index.json"),
  locations: path.join(PAGE_DIR, "cosmetic-locations.json"),
};

const STATIC_FILES = ["index.html", "app.js", "styles.css", "data-utils.js", "README.md", "LICENSE"];

async function fetchWithOptionalLocalFallback(url, fallbackPath, label) {
  try {
    return await readRemoteJson(url);
  } catch (error) {
    if (!fallbackPath) throw error;
    console.warn(`[import] ${label}: remote fetch failed, using local fallback (${fallbackPath})`);
    return readJson(fallbackPath);
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
