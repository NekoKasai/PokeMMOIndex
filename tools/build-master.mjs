import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PAGE_DIR = path.resolve(__dirname, "..");

export const DEFAULT_SOURCE_URLS = {
  items: "https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item.json",
  cosmetics: "https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item-cosmetic.json",
};

export const SLOT_BY_NUM = {
  1: "forehead",
  2: "hat",
  3: "hair",
  4: "eyes",
  5: "face",
  6: "back",
  7: "top",
  8: "gloves",
  9: "shoes",
  10: "legs",
  11: "rod",
  12: "bicycle",
};

const FESTIVAL_MAP = {
  0: "No Event",
  1: "Halloween",
  2: "Thanksgiving",
  3: "Xmas",
  4: "Lunar New Year",
  5: "Valentine's Day",
  6: "AprilFool's Day",
  7: "Easter",
  8: "St Patrick's Day",
  9: "USA Independence Day",
  10: "PokeMMO Anniversary",
};

export function normalizeName(name) {
  const input = String(name || "").trim().toLowerCase();
  if (!input) return "";

  return input
    .normalize("NFKD")
    .replace(/[’´`]/g, "'")
    .replace(/'/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toCosmeticId(name) {
  const normalized = normalizeName(name);
  return normalized ? normalized.replace(/ /g, "_") : "";
}

export function normalizeSlot(slot) {
  const s = normalizeName(slot);
  const map = {
    forehead: "forehead",
    hat: "hat",
    hair: "hair",
    eyes: "eyes",
    face: "face",
    back: "back",
    top: "top",
    shirt: "top",
    torso: "top",
    glove: "gloves",
    gloves: "gloves",
    shoe: "shoes",
    shoes: "shoes",
    leg: "legs",
    legs: "legs",
    pants: "legs",
    bottom: "legs",
    rod: "rod",
    bicycle: "bicycle",
    bike: "bicycle",
  };
  return map[s] || "other";
}

function arr(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function dedupeLocations(locations) {
  const seen = new Set();
  const out = [];
  for (const loc of locations || []) {
    const token = [normalizeName(loc.region), normalizeName(loc.city), normalizeName(loc.price)].join("|");
    if (seen.has(token)) continue;
    seen.add(token);
    out.push(loc);
  }
  return out;
}

function hasLimitationBit(limitationValues, bit) {
  for (const value of limitationValues) {
    const limitation = Number(value || 0);
    if (limitation !== 0 && (limitation & bit) === bit) return true;
  }
  return false;
}

function toWindowData(varName, data) {
  return `window.${varName} = ${JSON.stringify(data, null, 2)};\n`;
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function readRemoteJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed ${url}: ${res.status}`);
  return res.json();
}

export function buildMaster(inputs) {
  const items = arr(inputs?.items);
  const cosmetics = arr(inputs?.cosmetics);
  const vanity = inputs?.vanity || {};
  const locations = inputs?.locations || {};

  const itemNameById = new Map();
  for (const item of items) {
    const id = Number(item.id);
    const name = item.en_name || item.name || `Item ${id}`;
    itemNameById.set(id, name);
  }

  const byId = new Map();
  const duplicatesById = [];

  for (const cosmetic of cosmetics) {
    const itemId = Number(cosmetic.item_id);
    if (!itemNameById.has(itemId)) continue;

    const name = itemNameById.get(itemId);
    const id = toCosmeticId(name);
    if (!id) continue;

    const slot = normalizeSlot(SLOT_BY_NUM[Number(cosmetic.slot)] || "other");

    if (!byId.has(id)) {
      byId.set(id, {
        id,
        name,
        slot,
        itemId,
        itemIds: [itemId],
        availability: [],
        tags: [],
        giftShop: { isGiftShop: false, details: [] },
        buyable: { isBuyable: false, locations: [] },
        sources: { vanityIndex: [], findingGuide: [] },
        _limitation: [],
        _festival: [],
        _attribute: [],
      });
    } else {
      const prev = byId.get(id);
      if (!prev.itemIds.includes(itemId)) prev.itemIds.push(itemId);
      if (prev.slot !== slot) {
        duplicatesById.push({ id, reason: "slot_conflict", slots: [prev.slot, slot], itemId });
        prev.slot = "other";
      }
    }

    const row = byId.get(id);
    row._limitation.push(Number(cosmetic.limitation || 0));
    row._festival.push(Number(cosmetic.festival || 0));
    row._attribute.push(Number(cosmetic.attribute || 0));
  }

  const unmatchedInLocations = [];
  for (const [key, entriesRaw] of Object.entries(locations || {})) {
    const id = toCosmeticId(key);
    const entries = arr(entriesRaw).map((entry) => ({
      region: entry.region || "Unknown",
      city: entry.city || "Unknown",
      price: entry.price || "Unknown",
      source: entry.source || "",
    }));

    const row = byId.get(id);
    if (!row) {
      unmatchedInLocations.push({ key, id });
      continue;
    }
    row.sources.findingGuide.push(...entries);
  }

  const unmatchedInVanityIndex = [];
  for (const [key, entriesRaw] of Object.entries(vanity || {})) {
    const id = toCosmeticId(key);
    const entries = arr(entriesRaw).map((entry) => ({
      detail: entry.detail || "",
      source: entry.source || "",
    }));

    const row = byId.get(id);
    if (!row) {
      unmatchedInVanityIndex.push({ key, id });
      continue;
    }
    row.sources.vanityIndex.push(...entries);
  }

  const itemsOut = [];
  const missingSlot = [];

  for (const id of Array.from(byId.keys()).sort()) {
    const row = byId.get(id);

    row.sources.findingGuide = dedupeLocations(row.sources.findingGuide);
    row.buyable.locations = row.sources.findingGuide;

    const isGiftShopBySource = row.sources.vanityIndex.some((v) =>
      /gift\s*shop|reward\s*points/i.test(String(v.detail || ""))
    );
    const isGiftShopByLimitation = row._limitation.includes(0);

    const isBuyable = row.buyable.locations.length > 0;
    const isGiftShop = isGiftShopBySource || isGiftShopByLimitation;

    const isPvpReward =
      hasLimitationBit(row._limitation, 2) ||
      row.sources.vanityIndex.some((v) => /pvp|mystery\s*box/i.test(String(v.detail || "")));
    const isPveReward =
      hasLimitationBit(row._limitation, 32) ||
      row.sources.vanityIndex.some((v) => /pve|quest/i.test(String(v.detail || "")));
    const isEventOnly = hasLimitationBit(row._limitation, 4) || row._festival.some((f) => Number(f || 0) !== 0);
    const isSeasonal = hasLimitationBit(row._limitation, 8);
    const isLimited = hasLimitationBit(row._limitation, 1);

    row.giftShop = {
      isGiftShop,
      details: row.sources.vanityIndex.filter((v) =>
        /gift\s*shop|reward\s*points/i.test(String(v.detail || ""))
      ),
    };

    row.buyable.isBuyable = isBuyable;

    const availability = new Set();
    if (isBuyable) availability.add("Mart Items");
    if (isGiftShop) availability.add("Gift Shop");
    if (isPvpReward) availability.add("PvP Reward");
    if (isPveReward) availability.add("PvE Reward");
    if (isSeasonal) availability.add("Seasonal");
    if (isEventOnly) availability.add("Event Only");
    if (isLimited) availability.add("Limited");
    for (const fes of new Set(row._festival)) {
      if (fes !== 0 && FESTIVAL_MAP[fes] != null) availability.add(FESTIVAL_MAP[fes]);
    }
    row.availability = Array.from(availability);

    const tags = new Set();
    if (isBuyable) tags.add("Mart Items");
    if (isGiftShop) tags.add("Gift Shop");
    if (isSeasonal) tags.add("Seasonal");
    if (isEventOnly) {
      tags.add("Event Only");
      tags.add("Event");
    }
    if (isLimited) tags.add("Limited");
    if (isPvpReward) tags.add("PvP Reward");
    if (isPveReward) tags.add("PvE Reward");
    if (row._attribute.some((a) => (a & 8) !== 0)) tags.add("CO");
    row.tags = Array.from(tags);

    if (row.slot === "other") {
      missingSlot.push({ id: row.id, name: row.name, itemId: row.itemId });
    }

    delete row._limitation;
    delete row._festival;
    delete row._attribute;

    itemsOut.push(row);
  }

  const master = {
    version: 1,
    generatedAt: new Date().toISOString(),
    items: itemsOut,
  };

  const report = {
    unmatchedInLocations,
    unmatchedInVanityIndex,
    duplicatesById,
    missingSlot,
  };

  const summary = {
    items: master.items.length,
    unmatchedLocations: report.unmatchedInLocations.length,
    unmatchedVanity: report.unmatchedInVanityIndex.length,
    duplicates: report.duplicatesById.length,
    missingSlot: report.missingSlot.length,
  };

  return { master, report, summary };
}

export async function writeOutputs(data, outputDir, options = {}) {
  const { writeWrappers = true } = options;
  await fs.mkdir(outputDir, { recursive: true });

  const masterPath = path.join(outputDir, "cosmetics.master.json");
  const reportPath = path.join(outputDir, "build-report.json");

  await fs.writeFile(masterPath, JSON.stringify(data.master, null, 2));
  await fs.writeFile(reportPath, JSON.stringify(data.report, null, 2));

  if (writeWrappers) {
    await fs.writeFile(path.join(outputDir, "cosmetics.master.js"), toWindowData("COSMETICS_MASTER", data.master));
    await fs.writeFile(path.join(outputDir, "build-report.js"), toWindowData("BUILD_REPORT", data.report));
  }

  return { masterPath, reportPath };
}

async function cli() {
  const vanityPath = process.env.SOURCE_VANITY_FILE || path.join(PAGE_DIR, "sources", "vanity.json");
  const locationsPath = process.env.SOURCE_LOCATIONS_FILE || path.join(PAGE_DIR, "sources", "locations.json");
  let vanity = {};
  let locations = {};
  try {
    vanity = await readJson(vanityPath);
  } catch {
    console.warn(`[build] vanity source missing (${vanityPath}), using empty dataset`);
  }
  try {
    locations = await readJson(locationsPath);
  } catch {
    console.warn(`[build] locations source missing (${locationsPath}), using empty dataset`);
  }

  const inputs = {
    items: await readRemoteJson(DEFAULT_SOURCE_URLS.items),
    cosmetics: await readRemoteJson(DEFAULT_SOURCE_URLS.cosmetics),
    vanity,
    locations,
  };

  const data = buildMaster(inputs);
  const outDir = path.join(PAGE_DIR, "dist", "data");
  await writeOutputs(data, outDir, { writeWrappers: true });

  const shouldFail = data.summary.duplicates > 0 || data.summary.missingSlot > 0;
  const prefix = shouldFail ? "Build failed" : "Build done";
  console.log(
    `${prefix}: items=${data.summary.items}, unmatchedLocations=${data.summary.unmatchedLocations}, unmatchedVanity=${data.summary.unmatchedVanity}, duplicates=${data.summary.duplicates}, missingSlot=${data.summary.missingSlot}`
  );

  if (shouldFail) process.exit(2);
}

if (path.resolve(process.argv[1] || "") === __filename) {
  cli().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

