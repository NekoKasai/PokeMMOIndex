const VIRTUAL_ROW_HEIGHT = 70;
const VIRTUAL_BUFFER_ROWS = 6;
const SEARCH_DEBOUNCE_MS = 180;
const FETCH_TIMEOUT_MS = 10000;
const LANGUAGES = ['de', 'en'];
const GLOBAL_LANG_KEY = 'site_lang';
const I18N = {
  de: {
    headerTitle: 'PokeMMOIndex Cosmetics',
    headerSubtitle: 'Finde Cosmetics schneller mit Vorschau, Tags und Fundorten auf einen Blick.',
    sourceHub: 'Quelle: PokeMMOHub',
    sourceGit: 'GitHub: pokemmo-hub',
    loadingDataset: 'Lade Cosmetics-Master-Dataset...',
    loadFailed: 'Laden fehlgeschlagen: {message}',
    loadedDataset: 'Geladen: {count} Cosmetics aus dem Master-Dataset.{marketPart}',
    marketPartAvailable: ' Markt-Items: {count}.',
    marketPartUnavailable: ' Marktdaten nicht verfügbar.',
    noMasterFound: 'Kein gültiges Master-Dataset gefunden (lokal/remote/runtime). Prüfe den Zugriff auf raw.githubusercontent.com.',
    noValidItems: 'Master-Dataset geladen, aber keine gültigen Cosmetics gefunden.',
    genderFemale: 'Weiblich',
    genderMale: 'Männlich',
    labelLanguage: 'Sprache',
    labelGender: 'Geschlecht',
    labelGlobalSearch: 'Globale Suche',
    labelFavorites: 'Favoriten',
    labelShareCode: 'Outfit-Code',
    placeholderGlobalSearch: 'In allen Slots suchen',
    placeholderShareCode: 'Code einfügen',
    btnSave: 'Speichern',
    btnLoad: 'Laden',
    btnDelete: 'Löschen',
    btnGenerate: 'Kopieren',
    btnApply: 'Anwenden',
    btnRandomize: 'Zufällig',
    btnClear: 'Zurücksetzen',
    btnOpenAll: 'Alle öffnen',
    btnCloseAll: 'Alle schließen',
    btnClearTags: 'Tags löschen',
    filterByTags: 'Nach Tags filtern',
    preview: 'Vorschau',
    whereToGet: 'Wo man die ausgewählten Cosmetics bekommt',
    searchSlot: 'Suche {slot}',
    noneOption: '--- keine ---',
    filteredBy: 'Gefiltert nach "{query}" ({count})',
    itemCount: '{count} Items',
    expand: 'Ausklappen',
    collapse: 'Einklappen',
    noKnownShopLocations: 'Keine bekannten Shop-Standorte.',
    marketLabel: 'Markt:',
    marketNoData: 'Keine Marktdaten.',
    tagsLabel: 'Tags:',
    source: 'Quelle',
    route: 'Route',
    copy: 'Kopieren',
    routeCopied: 'Route kopiert.',
    routeCopyFail: 'Route konnte nicht kopiert werden.',
    selectCosmeticHint: 'Wähle ein Cosmetic, um Fundorte zu sehen.',
    dataHealth: 'Daten-Status',
    healthItems: 'Items',
    healthUnmatchedLocations: 'Unmatched Orte',
    healthUnmatchedVanity: 'Unmatched Vanity',
    healthLikelySpelling: 'Wahrsch. Schreibweise',
    healthNotWearable: 'Nicht tragbar',
    healthDuplicates: 'Duplikate',
    healthMissingSlot: 'Fehlender Slot',
    loadedWithWarnings: 'Geladen: {count} Cosmetics mit Warnungen: duplicates={duplicates}, missingSlot={missingSlot}.',
    favoritePrompt: 'Name für Favorit',
    favoritesSelect: 'Favoriten',
    outfitCodeGenerated: 'Outfit-Code erstellt.',
    outfitCodeCopied: 'Outfit-Code kopiert.',
    outfitCodeCopyFailed: 'Outfit-Code konnte nicht kopiert werden.',
    outfitCodeApplied: 'Outfit-Code angewendet.',
    invalidOutfitCode: 'Ungültiger Outfit-Code.',
    tagMartItems: 'Markt-Items',
    tagGiftShop: 'Gift Shop',
    tagPvpReward: 'PvP-Belohnung',
    tagPveReward: 'PvE-Belohnung',
    tagSeasonal: 'Saisonal',
    tagEvent: 'Event',
    tagEventOnly: 'Nur Event',
    tagLimited: 'Limitiert',
    tagCO: 'CO',
    marketShortNoData: 'Markt: keine Daten',
    marketShortNotListed: 'Markt: nicht gelistet',
    marketShortListed: 'Markt: {price} ({qty}x)',
    marketLongNoData: 'Keine Daten',
    marketLongNotListed: 'Aktuell nicht gelistet',
    marketLongListed: 'Jetzt gelistet - {price} - Menge {qty} - Listings {listings}',
    sceneBattle: 'Kampf',
    sceneBack: 'Hinten',
    sceneFront: 'Vorne',
    sceneSide: 'Seite',
    sceneFemale: 'Weiblich',
    sceneMale: 'Männlich',
    noTagsAvailable: 'Keine Tags verfügbar.',
    noneLabel: 'Keine',
  },
  en: {
    headerTitle: 'PokeMMOIndex Cosmetics',
    headerSubtitle: 'Find cosmetics faster with preview, tags, and where-to-get info at a glance.',
    sourceHub: 'Source: PokeMMOHub',
    sourceGit: 'GitHub: pokemmo-hub',
    loadingDataset: 'Loading cosmetics master dataset...',
    loadFailed: 'Load failed: {message}',
    loadedDataset: 'Loaded {count} cosmetics from master dataset.{marketPart}',
    marketPartAvailable: ' Market items: {count}.',
    marketPartUnavailable: ' Market data unavailable.',
    noMasterFound: 'No valid master dataset found (local/remote/runtime). Check network access to raw.githubusercontent.com.',
    noValidItems: 'Master dataset loaded but contains no valid cosmetic items.',
    genderFemale: 'Female',
    genderMale: 'Male',
    labelLanguage: 'Language',
    labelGender: 'Gender',
    labelGlobalSearch: 'Global Search',
    labelFavorites: 'Favorites',
    labelShareCode: 'Outfit Share Code',
    placeholderGlobalSearch: 'Search all slots',
    placeholderShareCode: 'Paste code',
    btnSave: 'Save',
    btnLoad: 'Load',
    btnDelete: 'Delete',
    btnGenerate: 'Copy',
    btnApply: 'Apply',
    btnRandomize: 'Randomize',
    btnClear: 'Clear',
    btnOpenAll: 'Open all',
    btnCloseAll: 'Close all',
    btnClearTags: 'Clear tags',
    filterByTags: 'Filter by tags',
    preview: 'Preview',
    whereToGet: 'Where to get selected cosmetics',
    searchSlot: 'Search {slot}',
    noneOption: '--- none ---',
    filteredBy: 'Filtered by "{query}" ({count})',
    itemCount: '{count} items',
    expand: 'Expand',
    collapse: 'Collapse',
    noKnownShopLocations: 'No known shop locations.',
    marketLabel: 'Market:',
    marketNoData: 'No market data.',
    tagsLabel: 'Tags:',
    source: 'Source',
    route: 'Route',
    copy: 'Copy',
    routeCopied: 'Route copied.',
    routeCopyFail: 'Could not copy route.',
    selectCosmeticHint: 'Select a cosmetic to see where to get it.',
    dataHealth: 'Data Health',
    healthItems: 'Items',
    healthUnmatchedLocations: 'Unmatched locations',
    healthUnmatchedVanity: 'Unmatched vanity',
    healthLikelySpelling: 'Likely spelling',
    healthNotWearable: 'Not wearable',
    healthDuplicates: 'Duplicates',
    healthMissingSlot: 'Missing slot',
    loadedWithWarnings: 'Loaded {count} cosmetics with warnings: duplicates={duplicates}, missingSlot={missingSlot}.',
    favoritePrompt: 'Favorite name',
    favoritesSelect: 'Favorites',
    outfitCodeGenerated: 'Outfit code generated.',
    outfitCodeCopied: 'Outfit code copied.',
    outfitCodeCopyFailed: 'Could not copy outfit code.',
    outfitCodeApplied: 'Outfit code applied.',
    invalidOutfitCode: 'Invalid outfit code.',
    tagMartItems: 'Mart Items',
    tagGiftShop: 'Gift Shop',
    tagPvpReward: 'PvP Reward',
    tagPveReward: 'PvE Reward',
    tagSeasonal: 'Seasonal',
    tagEvent: 'Event',
    tagEventOnly: 'Event Only',
    tagLimited: 'Limited',
    tagCO: 'CO',
    marketShortNoData: 'Market: no data',
    marketShortNotListed: 'Market: not listed',
    marketShortListed: 'Market: {price} ({qty}x)',
    marketLongNoData: 'No data',
    marketLongNotListed: 'Not currently listed',
    marketLongListed: 'Listed now - {price} - Qty {qty} - Listings {listings}',
    sceneBattle: 'Battle',
    sceneBack: 'Back',
    sceneFront: 'Front',
    sceneSide: 'Side',
    sceneFemale: 'Female',
    sceneMale: 'Male',
    noTagsAvailable: 'No tags available.',
    noneLabel: 'None',
  },
};

const SLOT_ORDER = [
  'forehead',
  'hat',
  'hair',
  'eyes',
  'face',
  'back',
  'top',
  'gloves',
  'shoes',
  'legs',
  'rod',
  'bicycle',
  'other',
];

const SLOT_TO_NUM = {
  forehead: 1,
  hat: 2,
  hair: 3,
  eyes: 4,
  face: 5,
  back: 6,
  top: 7,
  gloves: 8,
  shoes: 9,
  legs: 10,
  rod: 11,
  bicycle: 12,
};

const DEFAULT_CLOTHES = {
  1: 0,
  2: 0,
  3: 1183,
  4: 1441,
  5: 1322,
  6: 0,
  7: 1323,
  8: 0,
  9: 1327,
  10: 1316,
  11: 0,
  12: 0,
};

const SCENES = [
  { key: 0, labelKey: 'sceneBattle' },
  { key: 1, labelKey: 'sceneBack' },
  { key: 2, labelKey: 'sceneFront' },
  { key: 3, labelKey: 'sceneSide' },
  { key: 4, labelKey: 'sceneFemale', genderPose: 'female' },
  { key: 5, labelKey: 'sceneMale', genderPose: 'male' },
];

const GENDERS = ['female', 'male'];
const CATEGORY_ICON_URLS = {
  forehead: './assets/ears.png',
  hat: './assets/head.png',
  hair: './assets/hair.png',
  eyes: './assets/eyes.png',
  face: './assets/masks.png',
  back: './assets/back.png',
  top: './assets/top.png',
  gloves: './assets/gloves.png',
  shoes: './assets/shoes.png',
  legs: './assets/bottoms.png',
  rod: './assets/accessories.png',
  bicycle: './assets/particles.png',
};
const LOCAL_MASTER_JSON_PATHS = ['./data/cosmetics.master.json', './dist/data/cosmetics.master.json'];
const LOCAL_REPORT_JSON_PATHS = ['./data/build-report.json', './dist/data/build-report.json'];
const LOCAL_MASTER_WRAPPER_PATHS = ['./data/cosmetics.master.js', './dist/data/cosmetics.master.js'];
const LOCAL_REPORT_WRAPPER_PATHS = ['./data/build-report.js', './dist/data/build-report.js'];
const REMOTE_MASTER_JSON = 'https://nekokasai.github.io/PokeMMOIndex/data/cosmetics.master.json';
const REMOTE_REPORT_JSON = 'https://nekokasai.github.io/PokeMMOIndex/data/build-report.json';
const REMOTE_MASTER_WRAPPER = 'https://nekokasai.github.io/PokeMMOIndex/data/cosmetics.master.js';
const REMOTE_REPORT_WRAPPER = 'https://nekokasai.github.io/PokeMMOIndex/data/build-report.js';
const BASE_SOURCE_ITEMS = 'https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item.json';
const BASE_SOURCE_COSMETICS = 'https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item-cosmetic.json';
const SLOT_BY_NUM = {
  1: 'forehead',
  2: 'hat',
  3: 'hair',
  4: 'eyes',
  5: 'face',
  6: 'back',
  7: 'top',
  8: 'gloves',
  9: 'shoes',
  10: 'legs',
  11: 'rod',
  12: 'bicycle',
};
const DEV_REMOTE_MASTER_JSON = 'https://nekokasai.github.io/PokeMMOIndex/data/cosmetics.master.json';
const DEV_REMOTE_REPORT_JSON = 'https://nekokasai.github.io/PokeMMOIndex/data/build-report.json';
const JSON_CACHE = new Map();
const SCRIPT_LOAD_CACHE = new Set();
const SHARE_CODE_PREFIX = 'PMI1:';

const state = {
  master: null,
  report: null,
  marketByItemId: {},
  marketItemCount: 0,
  cosmeticMetaByItemId: {},
  items: [],
  bySlot: {},
  itemById: {},
  itemByItemId: {},
  selected: { ...DEFAULT_CLOTHES },
  language: 'de',
  gender: 'male',
  selectedTags: [],
  availableTags: [],
  globalSearch: '',
  searchBySlot: {},
  collapsedBySlot: {},
  collapsedLocationById: {},
  favorites: [],
  lastOutfitSignature: '',
};

const els = {
  status: document.getElementById('status'),
  health: document.getElementById('health'),
  slots: document.getElementById('slots'),
  languageSelect: document.getElementById('languageSelect'),
  gender: document.getElementById('gender'),
  globalSearch: document.getElementById('globalSearch'),
  favoriteSelect: document.getElementById('favoriteSelect'),
  saveFavoriteBtn: document.getElementById('saveFavoriteBtn'),
  loadFavoriteBtn: document.getElementById('loadFavoriteBtn'),
  deleteFavoriteBtn: document.getElementById('deleteFavoriteBtn'),
  shareCodeInput: document.getElementById('shareCodeInput'),
  copyShareBtn: document.getElementById('copyShareBtn'),
  applyShareBtn: document.getElementById('applyShareBtn'),
  toggleAllBtn: document.getElementById('toggleAllBtn'),
  clearTagsBtn: document.getElementById('clearTagsBtn'),
  tagFilterChips: document.getElementById('tagFilterChips'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  previewGrid: document.getElementById('previewGrid'),
  locationInfo: document.getElementById('locationInfo'),
  toggleLocationsBtn: document.getElementById('toggleLocationsBtn'),
};

init();

async function init() {
  try {
    setStatus(t('loadingDataset'));
    await loadMasterData();
    setupControls();
    restore();
    renderSlots();
    bindGlobal();
    renderAll();
    const marketPart = state.marketItemCount
      ? t('marketPartAvailable', { count: state.marketItemCount })
      : t('marketPartUnavailable');
    setStatus(t('loadedDataset', { count: state.items.length, marketPart }));
    renderDataHealth();
  } catch (error) {
    console.error(error);
    setStatus(t('loadFailed', { message: error.message }), 'error');
  }
}

async function loadMasterData() {
  state.master = await loadFirstAvailableJson(LOCAL_MASTER_JSON_PATHS);
  if (!state.master) state.master = globalThis.COSMETICS_MASTER || null;
  if (!state.master) {
    await loadFirstAvailableScript(LOCAL_MASTER_WRAPPER_PATHS);
    state.master = globalThis.COSMETICS_MASTER || null;
  }
  if (!state.master) state.master = await loadLocalJson(REMOTE_MASTER_JSON);
  if (!state.master) {
    await loadScript(REMOTE_MASTER_WRAPPER);
    state.master = globalThis.COSMETICS_MASTER || null;
  }
  if (!state.master && isDevMode()) state.master = await loadLocalJson(DEV_REMOTE_MASTER_JSON);

  state.report = await loadFirstAvailableJson(LOCAL_REPORT_JSON_PATHS);
  if (!state.report) state.report = globalThis.BUILD_REPORT || null;
  if (!state.report) {
    await loadFirstAvailableScript(LOCAL_REPORT_WRAPPER_PATHS);
    state.report = globalThis.BUILD_REPORT || null;
  }
  if (!state.report) state.report = await loadLocalJson(REMOTE_REPORT_JSON);
  if (!state.report) {
    await loadScript(REMOTE_REPORT_WRAPPER);
    state.report = globalThis.BUILD_REPORT || null;
  }
  if (!state.report && isDevMode()) state.report = await loadLocalJson(DEV_REMOTE_REPORT_JSON);

  if (!state.master) {
    const runtimeData = await buildBaseMasterRuntime();
    if (runtimeData) {
      state.master = runtimeData.master;
      if (!state.report) state.report = runtimeData.report;
    }
  }

  if (Array.isArray(state.master)) {
    state.master = { version: 1, generatedAt: new Date().toISOString(), items: state.master };
  }

  if (!state.master || !Array.isArray(state.master.items)) {
    throw new Error(t('noMasterFound'));
  }

  const rawItems = arr(state.master.items);
  const normalizedItems = rawItems
    .map((item) => normalizeMasterItem(item))
    .filter((item) => item.id && item.name && item.itemId > 0);

  if (!normalizedItems.length) {
    throw new Error(t('noValidItems'));
  }

  await loadCosmeticMetaData();
  await loadMarketData();
  state.items = normalizedItems
    .map((item) => ({ ...item, market: buildMarketInfo(item) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  state.availableTags = Array.from(
    new Set(
      state.items.flatMap((item) => arr(item.tags).filter(Boolean))
    )
  ).sort((a, b) => a.localeCompare(b));
  state.itemById = Object.fromEntries(state.items.map((item) => [item.id, item]));
  state.bySlot = buildSlotState(state.master?.index?.bySlot, state.itemById, state.items);

  const byItemId = {};
  for (const item of state.items) {
    if (!byItemId[item.itemId]) byItemId[item.itemId] = item;
    for (const id of arr(item.itemIds).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0)) {
      if (!byItemId[id]) byItemId[id] = item;
    }
  }
  state.itemByItemId = byItemId;
}

function normalizeMasterItem(item) {
  const normalizedName = String(item?.name || '').trim();
  const id = String(item?.id || toCosmeticId(normalizedName));
  const slot = normalizeSlot(item?.slot || 'other');

  const itemIds = arr(item?.itemIds)
    .map((idValue) => Number(idValue))
    .filter((idValue) => Number.isFinite(idValue) && idValue > 0);

  const itemId = Number(item?.itemId || itemIds[0] || 0);

  const normalized = {
    id,
    name: normalizedName,
    searchName: normalizeName(normalizedName),
    slot,
    itemId,
    itemIds,
    availability: arr(item?.availability),
    tags: arr(item?.tags),
    buyable: {
      isBuyable: Boolean(item?.buyable?.isBuyable),
      locations: arr(item?.buyable?.locations),
    },
    giftShop: {
      isGiftShop: Boolean(item?.giftShop?.isGiftShop),
      details: arr(item?.giftShop?.details),
    },
    sources: {
      vanityIndex: arr(item?.sources?.vanityIndex),
      findingGuide: arr(item?.sources?.findingGuide),
    },
    market: null,
  };
  normalized.tags = deriveDisplayTags(normalized);
  return normalized;
}

function deriveDisplayTags(item) {
  const tags = new Set();
  const existing = arr(item?.tags).map((t) => String(t || ''));
  const availability = arr(item?.availability).map((t) => normalizeName(String(t || '')));
  const vanityDetails = arr(item?.sources?.vanityIndex).map((v) => normalizeName(String(v?.detail || '')));

  if (Boolean(item?.buyable?.isBuyable) || availability.includes('mart items')) tags.add('Mart Items');
  if (Boolean(item?.giftShop?.isGiftShop) || availability.includes('gift shop')) tags.add('Gift Shop');
  if (existing.includes('PvP Reward') || availability.includes('pvp reward')) tags.add('PvP Reward');
  if (existing.includes('PvE Reward') || availability.includes('pve reward') || vanityDetails.some((d) => /pve|quest/.test(d))) tags.add('PvE Reward');
  if (existing.includes('Seasonal') || availability.includes('seasonal')) tags.add('Seasonal');
  if (existing.includes('Limited') || availability.includes('limited')) tags.add('Limited');
  if (existing.includes('Event Only') || existing.includes('Event') || availability.includes('event only')) {
    tags.add('Event Only');
    tags.add('Event');
  }
  if (existing.includes('CO')) tags.add('CO');

  const ids = [item.itemId, ...arr(item.itemIds)]
    .map((idValue) => Number(idValue))
    .filter((idValue) => Number.isFinite(idValue) && idValue > 0);
  for (const idValue of ids) {
    const metaTags = arr(state.cosmeticMetaByItemId[idValue]?.tags);
    for (const tag of metaTags) tags.add(tag);
  }

  return Array.from(tags);
}

function groupBySlot(items) {
  const grouped = {};
  for (const item of items) {
    const slot = normalizeSlot(item.slot);
    if (!grouped[slot]) grouped[slot] = [];
    grouped[slot].push(item);
  }
  for (const slot of Object.keys(grouped)) {
    grouped[slot].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

function buildSlotState(slotIndex, itemById, items) {
  if (slotIndex && typeof slotIndex === 'object') {
    const out = {};
    for (const [slot, ids] of Object.entries(slotIndex)) {
      out[slot] = arr(ids)
        .map((id) => itemById[id])
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    if (Object.keys(out).length) return out;
  }
  return groupBySlot(items);
}

function setupControls() {
  if (els.languageSelect) els.languageSelect.value = state.language;
  els.gender.innerHTML = GENDERS.map((g) => {
    const label = g === 'female' ? t('genderFemale') : t('genderMale');
    return `<option value="${g}">${escapeHTML(label)}</option>`;
  }).join('');
  applyStaticTranslations();
  renderFavorites();
  renderTagFilterChips();
}

function bindGlobal() {
  if (els.languageSelect) {
    els.languageSelect.addEventListener('change', () => {
      const next = String(els.languageSelect.value || 'de');
      state.language = LANGUAGES.includes(next) ? next : 'de';
      setupControls();
      renderSlots();
      renderAll();
      persist();
    });
  }

  els.gender.addEventListener('change', () => {
    state.gender = els.gender.value;
    renderAll();
    persist();
  });
  if (els.globalSearch) {
    const onGlobalSearch = debounce(() => {
      state.globalSearch = String(els.globalSearch.value || '').trim();
      renderAll();
      persist();
    }, SEARCH_DEBOUNCE_MS);
    els.globalSearch.addEventListener('input', onGlobalSearch);
  }

  els.randomizeBtn.addEventListener('click', randomizeSelection);
  els.clearBtn.addEventListener('click', clearSelection);
  els.toggleAllBtn.addEventListener('click', toggleAllSlots);
  els.clearTagsBtn.addEventListener('click', () => {
    state.selectedTags = [];
    renderAll();
    persist();
  });
  els.tagFilterChips.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-tag]');
    if (!btn) return;
    const tag = String(btn.dataset.tag || '');
    if (!tag) return;
    if (state.selectedTags.includes(tag)) {
      state.selectedTags = state.selectedTags.filter((t) => t !== tag);
    } else {
      state.selectedTags = [...state.selectedTags, tag];
    }
    renderAll();
    persist();
  });
  els.locationInfo.addEventListener('click', async (event) => {
    const locationToggle = event.target.closest('button[data-location-id]');
    if (locationToggle) {
      const locationId = String(locationToggle.dataset.locationId || '');
      if (!locationId) return;
      state.collapsedLocationById[locationId] = !Boolean(state.collapsedLocationById[locationId]);
      renderLocationInfo();
      persist();
      return;
    }

    const btn = event.target.closest('button[data-route]');
    if (!btn) return;
    const route = String(btn.dataset.route || '');
    if (!route) return;
    try {
      await navigator.clipboard.writeText(route);
      setStatus(t('routeCopied'));
    } catch {
      setStatus(t('routeCopyFail'), 'warning');
    }
  });
  if (els.saveFavoriteBtn) els.saveFavoriteBtn.addEventListener('click', saveFavorite);
  if (els.loadFavoriteBtn) els.loadFavoriteBtn.addEventListener('click', loadFavorite);
  if (els.deleteFavoriteBtn) els.deleteFavoriteBtn.addEventListener('click', deleteFavorite);
  if (els.copyShareBtn) els.copyShareBtn.addEventListener('click', copyShareCode);
  if (els.applyShareBtn) els.applyShareBtn.addEventListener('click', applyShareCode);
  if (els.toggleLocationsBtn) els.toggleLocationsBtn.addEventListener('click', toggleAllLocationItems);
}

function renderSlots() {
  const slots = Object.keys(state.bySlot).sort((a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b));
  const hasStoredCollapsed = Object.keys(state.collapsedBySlot).length > 0;
  if (!hasStoredCollapsed) {
    slots.forEach((slot, idx) => {
      state.collapsedBySlot[slot] = idx !== 0;
    });
  }

  els.slots.innerHTML = slots.map((slot) => {
    const list = getFilteredSlotItems(slot, state.searchBySlot[slot] || '');
    const isCollapsed = Boolean(state.collapsedBySlot[slot]);
    return `
      <section class="slot${isCollapsed ? ' collapsed' : ''}" data-slot="${escapeHTML(slot)}">
        <div class="slot-head">
          <h3 class="slot-title">${escapeHTML(localizeSlot(slot))}</h3>
          <button class="slot-toggle" type="button" data-role="toggle" aria-expanded="${isCollapsed ? 'false' : 'true'}">${isCollapsed ? t('expand') : t('collapse')}</button>
          <span class="slot-count">${t('itemCount', { count: list.length })}</span>
        </div>
        <input class="search" type="text" placeholder="${escapeHTML(t('searchSlot', { slot: localizeSlot(slot).toLowerCase() }))}" data-role="filter" value="${escapeHTML(state.searchBySlot[slot] || '')}" />
        <div class="list-info" data-role="info"></div>
        <div class="item-list" data-role="list"></div>
      </section>
    `;
  }).join('');

  els.slots.querySelectorAll('.slot').forEach((slotEl) => {
    const slot = String(slotEl.dataset.slot || 'other');
    const listEl = slotEl.querySelector('div[data-role="list"]');
    const filter = slotEl.querySelector('input[data-role="filter"]');
    const toggleBtn = slotEl.querySelector('button[data-role="toggle"]');

    if (isSlotCollapsed(slot)) {
      unloadSlotIcons(slotEl);
      listEl.innerHTML = '';
    } else {
      renderSlotList(slotEl, slot, getFilteredSlotItems(slot, state.searchBySlot[slot] || ''), state.searchBySlot[slot] || '');
    }

    listEl.addEventListener('click', (event) => {
      const row = event.target.closest('button[data-item-id]');
      if (!row) return;

      const slotNum = SLOT_TO_NUM[slot];
      if (!slotNum) return;

      const itemId = Number(row.dataset.itemId || 0);
      state.selected[slotNum] = itemId;
      renderAll();
      persist();
    });

    listEl.addEventListener('scroll', () => {
      if (isSlotCollapsed(slot)) return;
      renderVirtualRows(slotEl, slot);
    }, { passive: true });

    const debouncedInput = debounce(() => {
      const query = String(filter.value || '').trim();
      state.searchBySlot[slot] = query;
      const filtered = getFilteredSlotItems(slot, query);
      renderSlotList(slotEl, slot, filtered, query);
      updateSlotCount(slotEl, filtered.length);
    }, SEARCH_DEBOUNCE_MS);

    filter.addEventListener('input', debouncedInput);

    toggleBtn.addEventListener('click', () => {
      state.collapsedBySlot[slot] = !isSlotCollapsed(slot);
      renderAll();
      persist();
    });
  });
}

function renderSlotList(slotEl, slot, list, query) {
  const infoEl = slotEl.querySelector('div[data-role="info"]');
  slotEl._virtualItems = [{ itemId: 0, name: t('noneOption'), slot }, ...list];

  if (query) {
    infoEl.textContent = t('filteredBy', { query, count: list.length });
  } else {
    infoEl.textContent = t('itemCount', { count: list.length });
  }

  renderVirtualRows(slotEl, slot);
}

function renderVirtualRows(slotEl, slot) {
  const listEl = slotEl.querySelector('div[data-role="list"]');
  const items = slotEl._virtualItems || [];
  if (!items.length) {
    listEl.innerHTML = '';
    return;
  }

  const viewportHeight = listEl.clientHeight || 240;
  const scrollTop = listEl.scrollTop;
  const visibleRows = Math.ceil(viewportHeight / VIRTUAL_ROW_HEIGHT);
  const start = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - VIRTUAL_BUFFER_ROWS);
  const end = Math.min(items.length, start + visibleRows + VIRTUAL_BUFFER_ROWS * 2);
  const topPad = start * VIRTUAL_ROW_HEIGHT;
  const bottomPad = (items.length - end) * VIRTUAL_ROW_HEIGHT;
  const slotNum = SLOT_TO_NUM[slot] || 0;

  const rows = items.slice(start, end).map((item) => {
    const selected = Number(state.selected[slotNum] || 0) === Number(item.itemId || 0) ? ' selected' : '';

    if (!item.itemId) {
      return `<button class="item-row${selected}" data-item-id="0" style="height:${VIRTUAL_ROW_HEIGHT}px"><span class="item-name">${escapeHTML(t('noneOption'))}</span></button>`;
    }

    const marketText = formatMarketShort(item.market);
    const tagText = formatTagShort(item.tags);
    return `
      <button class="item-row${selected}" data-item-id="${item.itemId}" title="${escapeHTML(item.name)}" style="height:${VIRTUAL_ROW_HEIGHT}px">
        <span>
          <span class="item-name">${escapeHTML(item.name)}</span>
          <span class="item-meta">${escapeHTML(marketText)}</span>
          <span class="item-meta">${escapeHTML(tagText)}</span>
        </span>
      </button>
    `;
  }).join('');

  listEl.innerHTML = `
    <div style="height:${topPad}px"></div>
    ${rows}
    <div style="height:${bottomPad}px"></div>
  `;
}

function renderAll() {
  applyStaticTranslations();
  els.gender.value = state.gender;
  if (els.languageSelect) els.languageSelect.value = state.language;
  if (els.globalSearch) els.globalSearch.value = state.globalSearch;
  renderFavorites();
  renderTagFilterChips();
  if (els.toggleAllBtn) {
    els.toggleAllBtn.textContent = areAllSlotsCollapsed() ? t('btnOpenAll') : t('btnCloseAll');
  }

  for (const slot of Object.keys(state.bySlot)) {
    const slotEl = els.slots.querySelector(`.slot[data-slot="${slot}"]`);
    if (!slotEl) continue;

    const query = state.searchBySlot[slot] || '';
    const filtered = getFilteredSlotItems(slot, query);
    const collapsed = isSlotCollapsed(slot);

    slotEl.classList.toggle('collapsed', collapsed);
    const toggle = slotEl.querySelector('button[data-role="toggle"]');
    if (toggle) {
      toggle.textContent = collapsed ? t('expand') : t('collapse');
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    if (!collapsed) {
      renderSlotList(slotEl, slot, filtered, query);
    } else {
      unloadSlotIcons(slotEl);
      const listEl = slotEl.querySelector('div[data-role="list"]');
      if (listEl) listEl.innerHTML = '';
    }
    updateSlotCount(slotEl, filtered.length);
    if (!collapsed) {
      renderSlotIcon(slotEl, slot);
    } else {
      clearSlotHeadIcon(slotEl);
    }
  }

  renderPreview();
  renderLocationInfo();
  renderDataHealth();
  refreshShareCodeFromOutfit();
}

function renderSlotIcon(slotEl, slot) {
  let icon = slotEl.querySelector('.icon-crop');
  if (!icon) {
    icon = document.createElement('div');
    icon.className = 'icon-crop';
    icon.innerHTML = '<img alt="item icon" />';
    slotEl.querySelector('.slot-head').appendChild(icon);
  }

  const slotNum = SLOT_TO_NUM[slot] || 0;
  const itemId = Number(DEFAULT_CLOTHES[slotNum] || 0);
  const img = icon.querySelector('img');
  const categoryIcon = CATEGORY_ICON_URLS[slot] || '';

  if (categoryIcon) {
    img.style.display = 'block';
    img.classList.add('category-icon');
    img.src = categoryIcon;
    return;
  }

  if (!slotNum || !itemId) {
    img.src = '';
    img.classList.remove('category-icon');
    img.style.display = 'none';
    return;
  }

  img.style.display = 'block';
  img.classList.remove('category-icon');
  img.src = getItemIconUrl(slotNum, itemId);
}

function clearSlotHeadIcon(slotEl) {
  const icon = slotEl.querySelector('.icon-crop img');
  if (!icon) return;
  icon.src = '';
  icon.classList.remove('category-icon');
  icon.style.display = 'none';
}

function renderPreview() {
  const previewScenes = SCENES.filter((scene) => !scene.genderPose || scene.genderPose === state.gender);

  els.previewGrid.innerHTML = previewScenes.map((scene) => {
    const label = t(scene.labelKey);
    const src = buildAvatarUrl(scene.key, state.selected);
    return `
      <article class="preview-card">
        <div class="preview-image-wrap">
          <img class="main" src="${src}" alt="${escapeHTML(label)} preview" />
        </div>
        <span class="preview-label">${escapeHTML(label)}</span>
      </article>
    `;
  }).join('');
}

function renderLocationInfo() {
  const selectedItems = getSelectedLocationItems();
  const rows = selectedItems.map((item) => {
    const collapsed = Boolean(state.collapsedLocationById[item.id]);
    const locationEntries = arr(item.buyable?.locations);
    const vanityEntries = arr(item.sources?.vanityIndex);
    const market = item.market || null;

    let lines = '';
    if (!locationEntries.length && vanityEntries.length) {
      lines += `<div class="missing">${escapeHTML(t('noKnownShopLocations'))}</div>`;
    }

    for (const entry of locationEntries) {
      lines += renderLocationEntry(entry);
    }

    for (const entry of vanityEntries) {
      lines += `<div class="entry">${escapeHTML(entry.detail || t('tagMartItems'))}</div>`;
    }

    const sources = new Set();
    for (const entry of locationEntries) if (entry.source) sources.add(entry.source);
    for (const entry of vanityEntries) if (entry.source) sources.add(entry.source);

    const sourceLinks = Array.from(sources)
      .map((src) => `<a href="${escapeHTML(src)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('source'))}</a>`)
      .join(' - ');

    const marketSource = ` <a href="https://pokemmohub.com/items" target="_blank" rel="noopener noreferrer">${escapeHTML(t('source'))}</a>`;
    const marketLine = market
      ? `<div class="entry"><strong>${escapeHTML(t('marketLabel'))}</strong> ${escapeHTML(formatMarketLong(market))}${marketSource}</div>`
      : `<div class="entry"><strong>${escapeHTML(t('marketLabel'))}</strong> ${escapeHTML(t('marketNoData'))}${marketSource}</div>`;
    const tagsLine = `<div class="entry"><strong>${escapeHTML(t('tagsLabel'))}</strong> ${renderTagChips(item.tags)}</div>`;

    return `
      <div class="location-item${collapsed ? ' collapsed' : ''}">
        <div class="location-head">
          <div class="name">${escapeHTML(item.name)}</div>
          <button type="button" class="location-toggle-btn btn mini" data-location-id="${escapeHTML(item.id)}">${collapsed ? escapeHTML(t('expand')) : escapeHTML(t('collapse'))}</button>
        </div>
        <div class="location-body">
          ${marketLine}
          ${tagsLine}
          ${lines}
          ${sourceLinks ? `<div class="entry">${sourceLinks}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  els.locationInfo.innerHTML = rows || `<div class="location-item"><div class="missing">${escapeHTML(t('selectCosmeticHint'))}</div></div>`;
  updateLocationToggleButton(selectedItems);
}

function getSelectedLocationItems() {
  const selectedItems = Object.keys(state.selected)
    .map((slotNum) => Number(state.selected[slotNum]))
    .filter((itemId) => itemId > 0)
    .map((itemId) => state.itemByItemId[itemId])
    .filter(Boolean);
  const dedup = new Map();
  for (const item of selectedItems) {
    if (!dedup.has(item.id)) dedup.set(item.id, item);
  }
  return Array.from(dedup.values());
}

function areAllLocationItemsCollapsed(items = getSelectedLocationItems()) {
  if (!items.length) return false;
  return items.every((item) => Boolean(state.collapsedLocationById[item.id]));
}

function updateLocationToggleButton(items = getSelectedLocationItems()) {
  if (!els.toggleLocationsBtn) return;
  const hasItems = items.length > 0;
  els.toggleLocationsBtn.disabled = !hasItems;
  els.toggleLocationsBtn.textContent = areAllLocationItemsCollapsed(items) ? t('btnOpenAll') : t('btnCloseAll');
}

function toggleAllLocationItems() {
  const items = getSelectedLocationItems();
  if (!items.length) return;
  const collapseAll = !areAllLocationItemsCollapsed(items);
  for (const item of items) {
    state.collapsedLocationById[item.id] = collapseAll;
  }
  renderLocationInfo();
  persist();
}

function renderLocationEntry(entry) {
  const region = String(entry?.region || 'Unknown');
  const city = String(entry?.city || 'Unknown');
  const price = String(entry?.price || 'Unknown');
  const routeText = `${region} - ${city}`;
  const mapQuery = encodeURIComponent(`PokeMMO ${region} ${city}`);
  return `<div class="entry">${escapeHTML(region)} - ${escapeHTML(city)} - ${escapeHTML(price)} <a href="https://www.google.com/search?q=${mapQuery}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('route'))}</a> <button type="button" class="btn mini" data-route="${escapeHTML(routeText)}">${escapeHTML(t('copy'))}</button></div>`;
}

function renderDataHealth() {
  if (!els.health) return;

  const report = state.report || {};
  const unmatchedLocations = arr(report.unmatchedInLocations).length;
  const unmatchedVanity = arr(report.unmatchedInVanityIndex).length;
  const duplicates = arr(report.duplicatesById).length;
  const missingSlot = arr(report.missingSlot).length;
  const likelySpelling = arr(report.unmatchedSpellingLikely).length;
  const notWearable = arr(report.unmatchedNotWearable).length;

  const hasIssues = duplicates > 0 || missingSlot > 0;
  els.health.classList.toggle('warn', hasIssues);

  els.health.innerHTML = `
    <strong>${escapeHTML(t('dataHealth'))}</strong>
    <span>${escapeHTML(t('healthItems'))}: ${state.items.length}</span>
    <span>${escapeHTML(t('healthUnmatchedLocations'))}: ${unmatchedLocations}</span>
    <span>${escapeHTML(t('healthUnmatchedVanity'))}: ${unmatchedVanity}</span>
    <span>${escapeHTML(t('healthLikelySpelling'))}: ${likelySpelling}</span>
    <span>${escapeHTML(t('healthNotWearable'))}: ${notWearable}</span>
    <span>${escapeHTML(t('healthDuplicates'))}: ${duplicates}</span>
    <span>${escapeHTML(t('healthMissingSlot'))}: ${missingSlot}</span>
  `;

  if (hasIssues) {
    setStatus(t('loadedWithWarnings', { count: state.items.length, duplicates, missingSlot }), 'warning');
  }
}

function getFilteredSlotItems(slot, query = '') {
  let list = state.bySlot[slot] || [];

  if (state.selectedTags.length) {
    list = list.filter((item) => {
      const tags = arr(item.tags);
      return state.selectedTags.every((tag) => itemMatchesTagFilter(tags, tag));
    });
  }

  const q = normalizeName(query || '');
  if (q) {
    list = list.filter((item) => item.searchName.includes(q));
  }

  const globalQ = normalizeName(state.globalSearch || '');
  if (globalQ) {
    list = list.filter((item) => item.searchName.includes(globalQ));
  }

  return list;
}

function updateSlotCount(slotEl, count) {
  const countEl = slotEl.querySelector('.slot-count');
  if (countEl) countEl.textContent = t('itemCount', { count });
}

function randomizeSelection() {
  for (const slot of Object.keys(state.bySlot)) {
    const slotNum = SLOT_TO_NUM[slot] || 0;
    if (!slotNum) continue;

    const list = getFilteredSlotItems(slot, state.searchBySlot[slot] || '');
    const pick = list[Math.floor(Math.random() * list.length)];
    state.selected[slotNum] = pick ? pick.itemId : 0;
  }

  state.gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  renderAll();
  persist();
}

function clearSelection() {
  state.selected = { ...DEFAULT_CLOTHES };
  state.gender = 'male';
  renderAll();
  persist();
}

function renderFavorites() {
  if (!els.favoriteSelect) return;
  const options = [`<option value="">${escapeHTML(t('favoritesSelect'))}</option>`];
  for (const favorite of state.favorites) {
    options.push(`<option value="${escapeHTML(favorite.id)}">${escapeHTML(favorite.name)}</option>`);
  }
  els.favoriteSelect.innerHTML = options.join('');
}

function saveFavorite() {
  const name = window.prompt(t('favoritePrompt'));
  if (!name) return;
  const trimmed = String(name).trim().slice(0, 40);
  if (!trimmed) return;

  const favorite = {
    id: `${Date.now()}`,
    name: trimmed,
    gender: state.gender,
    selected: { ...state.selected },
  };
  state.favorites = [favorite, ...state.favorites].slice(0, 30);
  renderFavorites();
  persist();
}

function loadFavorite() {
  const id = String(els.favoriteSelect?.value || '');
  if (!id) return;
  const favorite = state.favorites.find((item) => item.id === id);
  if (!favorite) return;
  state.gender = favorite.gender;
  state.selected = { ...DEFAULT_CLOTHES, ...favorite.selected };
  renderAll();
  persist();
}

function deleteFavorite() {
  const id = String(els.favoriteSelect?.value || '');
  if (!id) return;
  state.favorites = state.favorites.filter((item) => item.id !== id);
  renderFavorites();
  persist();
}

function buildShareCode() {
  const payload = {
    v: 1,
    g: state.gender,
    s: sanitizeSelectedMap(state.selected),
  };
  return `${SHARE_CODE_PREFIX}${encodeBase64Url(JSON.stringify(payload))}`;
}

function getOutfitSignature() {
  return `${state.gender}|${JSON.stringify(sanitizeSelectedMap(state.selected))}`;
}

function refreshShareCodeFromOutfit(force = false) {
  if (!els.shareCodeInput) return;
  const signature = getOutfitSignature();
  if (!force && signature === state.lastOutfitSignature) return;
  state.lastOutfitSignature = signature;
  els.shareCodeInput.value = buildShareCode();
}

async function copyShareCode() {
  refreshShareCodeFromOutfit(true);
  const code = buildShareCode();
  if (els.shareCodeInput) els.shareCodeInput.value = code;
  const shareRow = els.shareCodeInput ? els.shareCodeInput.closest('.share-row') : null;
  try {
    await navigator.clipboard.writeText(code);
    setStatus(t('outfitCodeCopied'));
    showQuickHint(t('outfitCodeCopied'), 'success', shareRow);
  } catch {
    setStatus(t('outfitCodeCopyFailed'), 'warning');
    showQuickHint(t('outfitCodeCopyFailed'), 'warning', shareRow);
  }
}

function applyShareCode() {
  const raw = String(els.shareCodeInput?.value || '').trim();
  if (!raw) return;
  try {
    const parsed = parseShareCode(raw);
    if (GENDERS.includes(parsed.g)) state.gender = parsed.g;
    if (parsed.s && typeof parsed.s === 'object') {
      state.selected = { ...DEFAULT_CLOTHES, ...sanitizeSelectedMap(parsed.s) };
    }
    if (els.shareCodeInput) els.shareCodeInput.value = buildShareCode();
    renderAll();
    persist();
    setStatus(t('outfitCodeApplied'));
  } catch {
    setStatus(t('invalidOutfitCode'), 'error');
  }
}

function parseShareCode(code) {
  const input = String(code || '').trim();
  if (!input) throw new Error('empty');

  if (input.startsWith(SHARE_CODE_PREFIX)) {
    const payload = decodeBase64Url(input.slice(SHARE_CODE_PREFIX.length));
    return JSON.parse(payload);
  }

  try {
    return JSON.parse(decodeBase64Url(input));
  } catch {
    return JSON.parse(input);
  }
}

function sanitizeSelectedMap(value) {
  const src = value && typeof value === 'object' ? value : {};
  const out = {};
  for (const key of Object.keys(DEFAULT_CLOTHES)) {
    const num = Number(src[key]);
    out[key] = Number.isFinite(num) && num >= 0 ? Math.floor(num) : Number(DEFAULT_CLOTHES[key] || 0);
  }
  return out;
}

function encodeBase64Url(text) {
  const value = String(text || '');
  let base64 = '';
  try {
    const utf8 = new TextEncoder().encode(value);
    let binary = '';
    for (const b of utf8) binary += String.fromCharCode(b);
    base64 = btoa(binary);
  } catch {
    base64 = btoa(unescape(encodeURIComponent(value)));
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(encoded) {
  const safe = String(encoded || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = safe.length % 4 ? '='.repeat(4 - (safe.length % 4)) : '';
  const binary = atob(safe + pad);
  try {
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return decodeURIComponent(escape(binary));
  }
}

function toggleAllSlots() {
  const collapseAll = !areAllSlotsCollapsed();
  for (const slot of Object.keys(state.bySlot)) {
    state.collapsedBySlot[slot] = collapseAll;
  }
  renderAll();
  persist();
}

function getItemIconUrl(slotNum, itemId) {
  if (!slotNum || !itemId) return '';
  const solo = { ...DEFAULT_CLOTHES, [slotNum]: itemId };
  const sceneKey = slotNum === 6 ? 1 : 2;
  return buildAvatarUrl(sceneKey, solo);
}

function buildAvatarUrl(sceneKey, clothes) {
  return `https://apis.fiereu.de/pokemmoclothes/v1/${sceneKey}/2/1/${clothes[6]}/${clothes[12]}/${clothes[4]}/${clothes[5]}/${clothes[8]}/${clothes[3]}/${clothes[2]}/${clothes[10]}/${clothes[9]}/${clothes[7]}.png`;
}

function persist() {
  localStorage.setItem('clean_cosmetics_master_state', JSON.stringify({
    selected: state.selected,
    language: state.language,
    gender: state.gender,
    selectedTags: state.selectedTags,
    globalSearch: state.globalSearch,
    favorites: state.favorites,
    searchBySlot: state.searchBySlot,
    collapsedBySlot: state.collapsedBySlot,
    collapsedLocationById: state.collapsedLocationById,
  }));
  localStorage.setItem(GLOBAL_LANG_KEY, state.language);
}

function restore() {
  try {
    const raw = localStorage.getItem('clean_cosmetics_master_state');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed) return;

    if (parsed.selected) state.selected = { ...state.selected, ...parsed.selected };
    if (LANGUAGES.includes(parsed.language)) state.language = parsed.language;
    const globalLang = localStorage.getItem(GLOBAL_LANG_KEY);
    if (LANGUAGES.includes(globalLang)) state.language = globalLang;
    if (GENDERS.includes(parsed.gender)) state.gender = parsed.gender;
    state.selectedTags = Array.isArray(parsed.selectedTags) ? parsed.selectedTags.map(toFilterTag).filter(Boolean) : [];
    state.globalSearch = String(parsed.globalSearch || '');
    state.favorites = Array.isArray(parsed.favorites) ? parsed.favorites.filter(isValidFavorite).slice(0, 30) : [];
    state.searchBySlot = typeof parsed.searchBySlot === 'object' && parsed.searchBySlot ? parsed.searchBySlot : {};
    state.collapsedBySlot = typeof parsed.collapsedBySlot === 'object' && parsed.collapsedBySlot ? parsed.collapsedBySlot : {};
    state.collapsedLocationById = typeof parsed.collapsedLocationById === 'object' && parsed.collapsedLocationById ? parsed.collapsedLocationById : {};
  } catch {
  }
}

function setStatus(text, level = 'info') {
  els.status.textContent = text;
  els.status.classList.toggle('error', level === 'error');
  els.status.classList.toggle('warn', level === 'warning');
}

let quickHintTimer = null;
function showQuickHint(text, level = 'info', anchorEl = null) {
  if (!text) return;
  const id = anchorEl ? 'quickHintShare' : 'quickHint';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = 'quick-hint';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    if (anchorEl) {
      el.classList.add('share-hint');
      anchorEl.appendChild(el);
    } else {
      document.body.appendChild(el);
    }
  }

  el.textContent = text;
  el.classList.toggle('warning', level === 'warning');
  el.classList.toggle('error', level === 'error');
  el.classList.add('show');

  if (quickHintTimer) clearTimeout(quickHintTimer);
  quickHintTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 1800);
}

async function loadLocalJson(fileName) {
  if (!fileName) return null;
  if (JSON_CACHE.has(fileName)) return JSON_CACHE.get(fileName);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(fileName, { cache: 'default', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const json = await res.json();
    JSON_CACHE.set(fileName, json);
    return json;
  } catch {
    return null;
  }
}

async function loadFirstAvailableJson(paths) {
  for (const path of arr(paths)) {
    const data = await loadLocalJson(path);
    if (data) return data;
  }
  return null;
}

async function loadFirstAvailableScript(paths) {
  for (const path of arr(paths)) {
    const ok = await loadScript(path);
    if (ok) return true;
  }
  return false;
}

function loadScript(src) {
  if (!src) return Promise.resolve(false);
  if (SCRIPT_LOAD_CACHE.has(src)) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      SCRIPT_LOAD_CACHE.add(src);
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function buildBaseMasterRuntime() {
  try {
    const [itemsRaw, cosmeticsRaw] = await Promise.all([
      loadLocalJson(BASE_SOURCE_ITEMS),
      loadLocalJson(BASE_SOURCE_COSMETICS),
    ]);
    if (!Array.isArray(itemsRaw) || !Array.isArray(cosmeticsRaw)) return null;

    const itemNameById = new Map();
    for (const item of itemsRaw) {
      const id = Number(item?.id);
      if (!id) continue;
      itemNameById.set(id, String(item?.en_name || item?.name || `Item ${id}`));
    }

    const byId = new Map();
    for (const row of cosmeticsRaw) {
      const itemId = Number(row?.item_id);
      const name = itemNameById.get(itemId);
      if (!name) continue;

      const id = toCosmeticId(name);
      if (!id) continue;
      const slot = normalizeSlot(SLOT_BY_NUM[Number(row?.slot)] || 'other');

      if (!byId.has(id)) {
        byId.set(id, {
          id,
          name,
          slot,
          itemId,
          itemIds: [itemId],
          availability: [],
          tags: [],
          buyable: { isBuyable: false, locations: [] },
          giftShop: { isGiftShop: false, details: [] },
        });
      } else {
        const existing = byId.get(id);
        if (!existing.itemIds.includes(itemId)) existing.itemIds.push(itemId);
      }

      const item = byId.get(id);
      const limitation = Number(row?.limitation || 0);
      const festival = Number(row?.festival || 0);
      const attribute = Number(row?.attribute || 0);

      if (limitation === 0) item.tags.push('Gift Shop');
      if ((limitation & 1) === 1) item.tags.push('Limited');
      if ((limitation & 2) === 2) item.tags.push('PvP Reward');
      if ((limitation & 4) === 4 || festival !== 0) {
        item.tags.push('Event');
        item.tags.push('Event Only');
      }
      if ((limitation & 8) === 8) item.tags.push('Seasonal');
      if ((limitation & 32) === 32) item.tags.push('PvE Reward');
      if ((attribute & 8) === 8) item.tags.push('CO');
    }

    const out = Array.from(byId.values())
      .map((item) => ({
        ...item,
        tags: Array.from(new Set(arr(item.tags))),
        availability: Array.from(new Set(arr(item.availability))),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      master: {
        version: 1,
        generatedAt: new Date().toISOString(),
        items: out,
      },
      report: {
        unmatchedInLocations: [],
        unmatchedInVanityIndex: [],
        unmatchedSpellingLikely: [],
        unmatchedNotWearable: [],
        duplicatesById: [],
        missingSlot: [],
      },
    };
  } catch {
    return null;
  }
}

function isDevMode() {
  try {
    const params = new URLSearchParams(window.location.search || '');
    return params.get('dev') === '1';
  } catch {
    return false;
  }
}

function t(key, vars = {}) {
  const lang = LANGUAGES.includes(state.language) ? state.language : 'de';
  const base = I18N[lang] || I18N.de;
  const fallback = I18N.en || {};
  const template = base[key] ?? fallback[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

function localizeSlot(slot) {
  const map = {
    forehead: { de: 'Stirn', en: 'Forehead' },
    hat: { de: 'Hut', en: 'Hat' },
    hair: { de: 'Haare', en: 'Hair' },
    eyes: { de: 'Augen', en: 'Eyes' },
    face: { de: 'Gesicht', en: 'Face' },
    back: { de: 'Rücken', en: 'Back' },
    top: { de: 'Oberteil', en: 'Top' },
    gloves: { de: 'Handschuhe', en: 'Gloves' },
    shoes: { de: 'Schuhe', en: 'Shoes' },
    legs: { de: 'Beine', en: 'Legs' },
    rod: { de: 'Angel', en: 'Rod' },
    bicycle: { de: 'Fahrrad', en: 'Bicycle' },
    other: { de: 'Sonstiges', en: 'Other' },
  };
  const key = normalizeName(slot);
  const entry = map[key];
  if (!entry) return capitalize(String(slot || ''));
  return entry[state.language] || entry.de;
}

function localizeTag(tag) {
  const n = normalizeName(tag);
  const map = {
    'mart items': 'tagMartItems',
    'gift shop': 'tagGiftShop',
    'pvp reward': 'tagPvpReward',
    'pve reward': 'tagPveReward',
    seasonal: 'tagSeasonal',
    event: 'tagEvent',
    'event only': 'tagEventOnly',
    limited: 'tagLimited',
    co: 'tagCO',
  };
  const key = map[n];
  return key ? t(key) : String(tag || '');
}

function applyStaticTranslations() {
  const setText = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  };
  const setPlaceholder = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = t(key);
  };

  setText('headerTitle', 'headerTitle');
  setText('headerSubtitle', 'headerSubtitle');
  const sourceHub = document.getElementById('sourceHubLink');
  if (sourceHub) sourceHub.innerHTML = `<span class="link-icon">PH</span>${escapeHTML(t('sourceHub'))}`;
  const sourceGit = document.getElementById('sourceGitLink');
  if (sourceGit) sourceGit.innerHTML = `<span class="link-icon">GH</span>${escapeHTML(t('sourceGit'))}`;
  setText('labelLanguage', 'labelLanguage');
  setText('labelGender', 'labelGender');
  setText('labelGlobalSearch', 'labelGlobalSearch');
  setText('labelFavorites', 'labelFavorites');
  setText('labelShareCode', 'labelShareCode');
  setText('saveFavoriteBtn', 'btnSave');
  setText('loadFavoriteBtn', 'btnLoad');
  setText('deleteFavoriteBtn', 'btnDelete');
  setText('copyShareBtn', 'btnGenerate');
  setText('applyShareBtn', 'btnApply');
  setText('randomizeBtn', 'btnRandomize');
  setText('clearBtn', 'btnClear');
  setText('clearTagsBtn', 'btnClearTags');
  setText('filterByTagsTitle', 'filterByTags');
  setText('previewTitle', 'preview');
  setText('locationTitle', 'whereToGet');
  setPlaceholder('globalSearch', 'placeholderGlobalSearch');
  setPlaceholder('shareCodeInput', 'placeholderShareCode');
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function arr(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function isValidFavorite(value) {
  return value && typeof value === 'object' && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.selected === 'object';
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isSlotCollapsed(slot) {
  return Boolean(state.collapsedBySlot[slot]);
}

function areAllSlotsCollapsed() {
  const slots = Object.keys(state.bySlot);
  if (!slots.length) return false;
  return slots.every((slot) => isSlotCollapsed(slot));
}

function unloadSlotIcons(slotEl) {
  slotEl.querySelectorAll('.item-list img, .icon-crop img').forEach((img) => {
    img.src = '';
    img.removeAttribute('src');
  });
}

async function loadMarketData() {
  const url = 'https://apis.fiereu.de/pokemmoprices/v1/items';
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return;

    const data = await response.json();
    if (!Array.isArray(data)) return;

    const byId = {};
    for (const row of data) {
      const itemId = Number(row?.item_id);
      if (!itemId) continue;
      byId[itemId] = {
        itemId,
        tradable: Boolean(row?.tradable),
        price: Number(row?.price || 0),
        quantity: Number(row?.quantity || 0),
        listings: Number(row?.listings || 0),
        lastUpdated: String(row?.last_updated || ''),
      };
    }

    state.marketByItemId = byId;
    state.marketItemCount = Object.keys(byId).length;
  } catch {
    state.marketByItemId = {};
    state.marketItemCount = 0;
  }
}

async function loadCosmeticMetaData() {
  const url = 'https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/master/src/data/pokemmo/item-cosmetic.json';
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data)) return;

    const byItemId = {};
    for (const row of data) {
      const itemId = Number(row?.item_id);
      if (!itemId) continue;
      if (!byItemId[itemId]) byItemId[itemId] = { tags: new Set() };

      const limitation = Number(row?.limitation || 0);
      const festival = Number(row?.festival || 0);
      const target = byItemId[itemId].tags;

      if ((limitation & 1) === 1) target.add('Limited');
      if ((limitation & 8) === 8) target.add('Seasonal');
      if ((limitation & 4) === 4 || festival !== 0) {
        target.add('Event Only');
        target.add('Event');
      }
    }

    state.cosmeticMetaByItemId = Object.fromEntries(
      Object.entries(byItemId).map(([key, value]) => [key, { tags: Array.from(value.tags) }])
    );
  } catch {
    state.cosmeticMetaByItemId = {};
  }
}

function buildMarketInfo(item) {
  const ids = [item.itemId, ...arr(item.itemIds)]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  let best = null;
  for (const id of ids) {
    const row = state.marketByItemId[id];
    if (!row) continue;
    if (!best) {
      best = row;
      continue;
    }
    const bestListed = best.quantity > 0;
    const rowListed = row.quantity > 0;
    if (rowListed && !bestListed) {
      best = row;
      continue;
    }
    if (rowListed === bestListed && row.price > 0 && (best.price === 0 || row.price < best.price)) {
      best = row;
    }
  }

  if (!best) return null;
  return {
    ...best,
    isListed: best.quantity > 0,
  };
}

function formatMarketShort(market) {
  if (!market) return t('marketShortNoData');
  if (!market.isListed) return t('marketShortNotListed');
  return t('marketShortListed', { price: formatYen(market.price), qty: market.quantity });
}

function formatMarketLong(market) {
  if (!market) return t('marketLongNoData');
  if (!market.isListed) return t('marketLongNotListed');
  return t('marketLongListed', { price: formatYen(market.price), qty: market.quantity, listings: market.listings });
}

function formatYen(value) {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat('en-US').format(amount)} Pokeyen`;
}

function formatTagShort(tags) {
  const all = arr(tags).filter(Boolean);
  if (!all.length) return `${t('tagsLabel')} ${t('noneLabel').toLowerCase()}`;
  const short = all.slice(0, 2).map((tag) => localizeTag(tag)).join(', ');
  if (all.length <= 2) return `${t('tagsLabel')} ${short}`;
  return `${t('tagsLabel')} ${short} +${all.length - 2}`;
}

function renderTagChips(tags) {
  const all = arr(tags).filter(Boolean);
  if (!all.length) return `<span class="tag-chip">${escapeHTML(t('noneLabel'))}</span>`;
  return all
    .map((tag) => `<span class="tag-chip ${tagClassName(tag)}">${escapeHTML(localizeTag(tag))}</span>`)
    .join(' ');
}

function tagClassName(tag) {
  const normalized = normalizeName(tag);
  const map = {
    'mart items': 'tag-mart',
    'pvp reward': 'tag-pvp',
    'gift shop': 'tag-gift',
    seasonal: 'tag-seasonal',
    'event only': 'tag-event',
    event: 'tag-event',
    limited: 'tag-limited',
    'pve reward': 'tag-pve',
  };
  return map[normalized] || 'tag-default';
}

function renderTagFilterChips() {
  if (!els.tagFilterChips) return;
  const filterTags = Array.from(new Set(state.availableTags.map((tag) => toFilterTag(tag)).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const chips = filterTags.map((tag) => {
    const selected = state.selectedTags.includes(tag) ? ' selected' : '';
    return `<button type="button" class="tag-chip ${tagClassName(tag)}${selected}" data-tag="${escapeHTML(tag)}">${escapeHTML(localizeTag(tag))}</button>`;
  }).join('');
  els.tagFilterChips.innerHTML = chips || `<span class="item-meta">${escapeHTML(t('noTagsAvailable'))}</span>`;
}

function toFilterTag(tag) {
  const value = String(tag || '');
  if (!value) return '';
  if (value === 'Event Only') return 'Event';
  return value;
}

function itemMatchesTagFilter(tags, filterTag) {
  if (filterTag === 'Event') {
    return tags.includes('Event') || tags.includes('Event Only');
  }
  return tags.includes(filterTag);
}






