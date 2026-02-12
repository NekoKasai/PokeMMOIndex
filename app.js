const VIRTUAL_ROW_HEIGHT = 70;
const VIRTUAL_BUFFER_ROWS = 6;
const SEARCH_DEBOUNCE_MS = 180;

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
  { key: 0, label: 'Battle' },
  { key: 1, label: 'Back' },
  { key: 2, label: 'Front' },
  { key: 3, label: 'Side' },
  { key: 4, label: 'Female', genderPose: 'female' },
  { key: 5, label: 'Male', genderPose: 'male' },
];

const GENDERS = ['female', 'male'];
const CATEGORY_ICON_URLS = {
  back: 'https://images.shoutwiki.com/pokemmo/2/21/Vanity_Back_Grey.png',
  top: 'https://images.shoutwiki.com/pokemmo/9/94/Vanity_Top_Red.png',
  hat: 'https://images.shoutwiki.com/pokemmo/b/bd/Vanity_Hat_Grey.png',
  bicycle: 'https://images.shoutwiki.com/pokemmo/2/25/Vanity_Bicycle_Yellow.png',
  gloves: 'https://images.shoutwiki.com/pokemmo/e/eb/Vanity_Gloves_Grey.png',
  face: 'https://images.shoutwiki.com/pokemmo/3/34/Vanity_Face_Grey.png',
  hair: 'https://images.shoutwiki.com/pokemmo/f/f2/Vanity_Hair_Grey.png',
  eyes: 'https://images.shoutwiki.com/pokemmo/c/c4/Vanity_Eyes_Grey.png',
};

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
  gender: 'male',
  selectedTags: [],
  availableTags: [],
  searchBySlot: {},
  collapsedBySlot: {},
};

const els = {
  status: document.getElementById('status'),
  health: document.getElementById('health'),
  slots: document.getElementById('slots'),
  gender: document.getElementById('gender'),
  toggleAllBtn: document.getElementById('toggleAllBtn'),
  clearTagsBtn: document.getElementById('clearTagsBtn'),
  tagFilterChips: document.getElementById('tagFilterChips'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  previewGrid: document.getElementById('previewGrid'),
  locationInfo: document.getElementById('locationInfo'),
};

init();

async function init() {
  try {
    setStatus('Loading cosmetics master dataset...');
    await loadMasterData();
    setupControls();
    renderSlots();
    restore();
    bindGlobal();
    renderAll();
    const marketPart = state.marketItemCount ? ` Market items: ${state.marketItemCount}.` : ' Market data unavailable.';
    setStatus(`Loaded ${state.items.length} cosmetics from master dataset.${marketPart}`);
    renderDataHealth();
  } catch (error) {
    console.error(error);
    setStatus(`Load failed: ${error.message}`, 'error');
  }
}

async function loadMasterData() {
  state.master = await loadLocalJson('cosmetics.master.json');
  if (!state.master) state.master = globalThis.COSMETICS_MASTER || null;
  if (!state.master) state.master = await loadRemoteMasterFallback();

  state.report = await loadLocalJson('build-report.json');
  if (!state.report) state.report = globalThis.BUILD_REPORT || null;

  if (!state.master || !Array.isArray(state.master.items)) {
    throw new Error('No valid master dataset found. Serve the page with a local web server and ensure cosmetics.master.json exists.');
  }

  const rawItems = arr(state.master.items);
  const normalizedItems = rawItems
    .map((item) => normalizeMasterItem(item))
    .filter((item) => item.id && item.name && item.itemId > 0);

  if (!normalizedItems.length) {
    throw new Error('Master dataset loaded but contains no valid cosmetic items.');
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
  state.bySlot = groupBySlot(state.items);
  state.itemById = Object.fromEntries(state.items.map((item) => [item.id, item]));

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

function setupControls() {
  els.gender.innerHTML = GENDERS.map((g) => `<option value="${g}">${capitalize(g)}</option>`).join('');
  renderTagFilterChips();
}

function bindGlobal() {
  els.gender.addEventListener('change', () => {
    state.gender = els.gender.value;
    renderAll();
    persist();
  });

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
          <h3 class="slot-title">${escapeHTML(slot)}</h3>
          <button class="slot-toggle" type="button" data-role="toggle" aria-expanded="${isCollapsed ? 'false' : 'true'}">${isCollapsed ? 'Expand' : 'Collapse'}</button>
          <span class="slot-count">${list.length} items</span>
        </div>
        <input class="search" type="text" placeholder="Search ${escapeHTML(slot)}" data-role="filter" value="${escapeHTML(state.searchBySlot[slot] || '')}" />
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
    });

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
  slotEl._virtualItems = [{ itemId: 0, name: '--- none ---', slot }, ...list];

  if (query) {
    infoEl.textContent = `Filtered by "${query}" (${list.length})`;
  } else {
    infoEl.textContent = `${list.length} items`;
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
      return `<button class="item-row${selected}" data-item-id="0" style="height:${VIRTUAL_ROW_HEIGHT}px"><span class="item-name">--- none ---</span></button>`;
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
  els.gender.value = state.gender;
  renderTagFilterChips();
  if (els.toggleAllBtn) {
    els.toggleAllBtn.textContent = areAllSlotsCollapsed() ? 'Open all' : 'Close all';
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
      toggle.textContent = collapsed ? 'Expand' : 'Collapse';
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
    const src = buildAvatarUrl(scene.key, state.selected);
    return `
      <article class="preview-card">
        <div class="preview-image-wrap">
          <img class="main" src="${src}" alt="${escapeHTML(scene.label)} preview" />
        </div>
        <span class="preview-label">${escapeHTML(scene.label)}</span>
      </article>
    `;
  }).join('');
}

function renderLocationInfo() {
  const selectedItems = Object.keys(state.selected)
    .map((slotNum) => Number(state.selected[slotNum]))
    .filter((itemId) => itemId > 0)
    .map((itemId) => state.itemByItemId[itemId])
    .filter(Boolean);

  const dedup = new Map();
  for (const item of selectedItems) {
    if (!dedup.has(item.id)) dedup.set(item.id, item);
  }

  const rows = Array.from(dedup.values()).map((item) => {
    const locationEntries = arr(item.buyable?.locations);
    const vanityEntries = arr(item.sources?.vanityIndex);
    const market = item.market || null;

    let lines = '';
    if (!locationEntries.length && vanityEntries.length) {
      lines += `<div class="missing">No known shop locations.</div>`;
    }

    for (const entry of locationEntries) {
      lines += `<div class="entry">${escapeHTML(entry.region || 'Unknown')} - ${escapeHTML(entry.city || 'Unknown')} - ${escapeHTML(entry.price || 'Unknown')}</div>`;
    }

    for (const entry of vanityEntries) {
      lines += `<div class="entry">${escapeHTML(entry.detail || 'Buyable')}</div>`;
    }

    const sources = new Set();
    for (const entry of locationEntries) if (entry.source) sources.add(entry.source);
    for (const entry of vanityEntries) if (entry.source) sources.add(entry.source);

    const sourceLinks = Array.from(sources)
      .map((src) => `<a href="${escapeHTML(src)}" target="_blank" rel="noopener noreferrer">Source</a>`)
      .join(' - ');

    const marketSource = ' <a href="https://pokemmohub.com/items" target="_blank" rel="noopener noreferrer">Source</a>';
    const marketLine = market
      ? `<div class="entry"><strong>Market:</strong> ${escapeHTML(formatMarketLong(market))}${marketSource}</div>`
      : `<div class="entry"><strong>Market:</strong> No market data.${marketSource}</div>`;
    const tagsLine = `<div class="entry"><strong>Tags:</strong> ${renderTagChips(item.tags)}</div>`;

    return `
      <div class="location-item">
        <div class="name">${escapeHTML(item.name)}</div>
        ${marketLine}
        ${tagsLine}
        ${lines}
        ${sourceLinks ? `<div class="entry">${sourceLinks}</div>` : ''}
      </div>
    `;
  }).join('');

  els.locationInfo.innerHTML = rows || '<div class="location-item"><div class="missing">Select a cosmetic to see where to get it.</div></div>';
}

function renderDataHealth() {
  if (!els.health) return;

  const report = state.report || {};
  const unmatchedLocations = arr(report.unmatchedInLocations).length;
  const unmatchedVanity = arr(report.unmatchedInVanityIndex).length;
  const duplicates = arr(report.duplicatesById).length;
  const missingSlot = arr(report.missingSlot).length;

  const hasIssues = duplicates > 0 || missingSlot > 0;
  els.health.classList.toggle('warn', hasIssues);

  els.health.innerHTML = `
    <strong>Data Health</strong>
    <span>Items: ${state.items.length}</span>
    <span>Unmatched locations: ${unmatchedLocations}</span>
    <span>Unmatched vanity: ${unmatchedVanity}</span>
    <span>Duplicates: ${duplicates}</span>
    <span>Missing slot: ${missingSlot}</span>
  `;

  if (hasIssues) {
    setStatus(`Loaded ${state.items.length} cosmetics with warnings: duplicates=${duplicates}, missingSlot=${missingSlot}.`, 'warning');
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

  return list;
}

function updateSlotCount(slotEl, count) {
  const countEl = slotEl.querySelector('.slot-count');
  if (countEl) countEl.textContent = `${count} items`;
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
    gender: state.gender,
    selectedTags: state.selectedTags,
    searchBySlot: state.searchBySlot,
    collapsedBySlot: state.collapsedBySlot,
  }));
}

function restore() {
  try {
    const raw = localStorage.getItem('clean_cosmetics_master_state');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed) return;

    if (parsed.selected) state.selected = { ...state.selected, ...parsed.selected };
    if (GENDERS.includes(parsed.gender)) state.gender = parsed.gender;
    state.selectedTags = Array.isArray(parsed.selectedTags) ? parsed.selectedTags.map(toFilterTag).filter(Boolean) : [];
    state.searchBySlot = typeof parsed.searchBySlot === 'object' && parsed.searchBySlot ? parsed.searchBySlot : {};
    state.collapsedBySlot = typeof parsed.collapsedBySlot === 'object' && parsed.collapsedBySlot ? parsed.collapsedBySlot : {};
  } catch {
  }
}

function setStatus(text, level = 'info') {
  els.status.textContent = text;
  els.status.classList.toggle('error', level === 'error');
  els.status.classList.toggle('warn', level === 'warning');
}

async function loadLocalJson(fileName) {
  try {
    const res = await fetch(fileName, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadRemoteMasterFallback() {
  const fallbackUrl = 'https://raw.githubusercontent.com/NekoKasai/PokeMMOHelper/main/cosmetics.master.json';
  try {
    const res = await fetch(fallbackUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
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
  if (!market) return 'Market: no data';
  if (!market.isListed) return 'Market: not listed';
  return `Market: ${formatYen(market.price)} (${market.quantity}x)`;
}

function formatMarketLong(market) {
  if (!market) return 'No data';
  if (!market.isListed) return 'Not currently listed';
  return `Listed now - ${formatYen(market.price)} - Qty ${market.quantity} - Listings ${market.listings}`;
}

function formatYen(value) {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat('en-US').format(amount)} Pokeyen`;
}

function formatTagShort(tags) {
  const all = arr(tags).filter(Boolean);
  if (!all.length) return 'Tags: none';
  const short = all.slice(0, 2).join(', ');
  if (all.length <= 2) return `Tags: ${short}`;
  return `Tags: ${short} +${all.length - 2}`;
}

function renderTagChips(tags) {
  const all = arr(tags).filter(Boolean);
  if (!all.length) return '<span class="tag-chip">None</span>';
  return all
    .map((tag) => `<span class="tag-chip ${tagClassName(tag)}">${escapeHTML(tag)}</span>`)
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
    return `<button type="button" class="tag-chip ${tagClassName(tag)}${selected}" data-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`;
  }).join('');
  els.tagFilterChips.innerHTML = chips || '<span class="item-meta">No tags available.</span>';
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





