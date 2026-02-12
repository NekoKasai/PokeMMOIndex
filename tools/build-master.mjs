import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAGE_DIR = path.resolve(__dirname, "..");

const INPUTS = {
  vanity: path.join(PAGE_DIR, "buyable-from-vanity-index.json"),
  locations: path.join(PAGE_DIR, "cosmetic-locations.json"),
};

const OUTPUTS = {
  master: path.join(PAGE_DIR, "cosmetics.master.json"),
  report: path.join(PAGE_DIR, "build-report.json"),
  masterJs: path.join(PAGE_DIR, "cosmetics.master.js"),
  reportJs: path.join(PAGE_DIR, "build-report.js"),
};

const SOURCES = {
  items: "https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item.json",
  cosmetics: "https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item-cosmetic.json",
};

const SLOT_BY_NUM = {
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

const LIMITATION_MAP = {
  0: "Gift Shop",
  1: "Limited",
  2: "PvP Reward",
  4: "Event Only",
  8: "Seasonal",
  16: "Ultra Rare Event",
  20: "Limited",
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

function normalizeName(name) {
  const input = String(name || "").trim().toLowerCase();
  if (!input) return "";

  return input
    .normalize("NFKD")
    .replace(/[\u2019\u00B4`]/g, "'")
    .replace(/'/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toCosmeticId(name) {
  const normalized = normalizeName(name);
  return normalized ? normalized.replace(/ /g, "_") : "";
}

function normalizeSlot(slot) {
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

function arr(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function toWindowData(varName, data) {
  return `window.${varName} = ${JSON.stringify(data, null, 2)};\n`;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function readRemoteJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${url}: ${res.status}`);
  return res.json();
}

async function main() {
  const [items, cosmetics, vanity, locations] = await Promise.all([
    readRemoteJson(SOURCES.items),
    readRemoteJson(SOURCES.cosmetics),
    readJson(INPUTS.vanity),
    readJson(INPUTS.locations),
  ]);

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

    const isBuyableByVanityDetail = row.sources.vanityIndex.some((v) =>
      /pokeyen|coins|shop|store|mart/i.test(String(v.detail || ""))
    );

    const isGiftShopBySource = row.sources.vanityIndex.some((v) =>
      /gift\s*shop|reward\s*points/i.test(String(v.detail || ""))
    );
    const isGiftShopByLimitation = row._limitation.includes(0);

    row.giftShop = {
      isGiftShop: isGiftShopBySource || isGiftShopByLimitation,
      details: row.sources.vanityIndex.filter((v) =>
        /gift\s*shop|reward\s*points/i.test(String(v.detail || ""))
      ),
    };

    row.buyable.isBuyable = row.buyable.locations.length > 0 || isBuyableByVanityDetail;

    const availability = new Set();
    for (const lim of new Set(row._limitation)) {
      if (LIMITATION_MAP[lim] != null) availability.add(LIMITATION_MAP[lim]);
    }
    for (const fes of new Set(row._festival)) {
      if (fes !== 0 && FESTIVAL_MAP[fes] != null) availability.add(FESTIVAL_MAP[fes]);
    }
    row.availability = Array.from(availability);

    const tags = new Set();
    if (row.buyable.isBuyable) tags.add("Buyable");
    if (row.giftShop.isGiftShop) tags.add("Gift Shop");
    if (row.availability.includes("Event Only") || row._festival.some((f) => f !== 0)) tags.add("Event");
    if (row.availability.includes("Seasonal")) tags.add("Seasonal");
    if (row.availability.includes("Limited")) tags.add("Limited");
    if (row.availability.includes("PvP Reward")) tags.add("PvP Reward");
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

  await fs.writeFile(OUTPUTS.master, JSON.stringify(master, null, 2));
  await fs.writeFile(OUTPUTS.report, JSON.stringify(report, null, 2));
  await fs.writeFile(OUTPUTS.masterJs, toWindowData("COSMETICS_MASTER", master));
  await fs.writeFile(OUTPUTS.reportJs, toWindowData("BUILD_REPORT", report));

  const shouldFail = report.missingSlot.length > 0 || report.duplicatesById.length > 0;
  if (shouldFail) {
    console.error(`Build failed: duplicatesById=${report.duplicatesById.length}, missingSlot=${report.missingSlot.length}`);
    process.exit(2);
  }

  console.log(
    `Build done: items=${master.items.length}, unmatchedLocations=${report.unmatchedInLocations.length}, unmatchedVanity=${report.unmatchedInVanityIndex.length}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});