const VIRTUAL_ROW_HEIGHT = 42;
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

const state = {
  master: null,
  report: null,
  items: [],
  bySlot: {},
  itemById: {},
  itemByItemId: {},
  selected: { ...DEFAULT_CLOTHES },
  gender: 'male',
  onlyBuyable: false,
  onlyGiftShop: false,
  searchBySlot: {},
};

const els = {
  status: document.getElementById('status'),
  health: document.getElementById('health'),
  slots: document.getElementById('slots'),
  gender: document.getElementById('gender'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  previewGrid: document.getElementById('previewGrid'),
  locationInfo: document.getElementById('locationInfo'),
  onlyBuyable: document.getElementById('onlyBuyable'),
  onlyGiftShop: document.getElementById('onlyGiftShop'),
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
    setStatus(`Loaded ${state.items.length} cosmetics from master dataset.`);
    renderDataHealth();
  } catch (error) {
    console.error(error);
    setStatus(`Load failed: ${error.message}`, true);
  }
}

async function loadMasterData() {
  state.master = globalThis.COSMETICS_MASTER || null;
  state.report = globalThis.BUILD_REPORT || null;

  if (!state.master) {
    const masterRes = await fetch('cosmetics.master.json', { cache: 'no-store' });
    if (!masterRes.ok) {
      throw new Error('Could not load cosmetics.master.json');
    }
    state.master = await masterRes.json();
  }

  if (!state.report) {
    try {
      const reportRes = await fetch('build-report.json', { cache: 'no-store' });
      state.report = reportRes.ok ? await reportRes.json() : null;
    } catch {
      state.report = null;
    }
  }

  const rawItems = arr(state.master?.items);
  const normalizedItems = rawItems
    .map((item) => normalizeMasterItem(item))
    .filter((item) => item.id && item.name && item.itemId > 0);

  state.items = normalizedItems.sort((a, b) => a.name.localeCompare(b.name));
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

  return {
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
  };
}

function groupBySlot(items) {
  const grouped = {};
  for (const item of items) {
    const slot = normalizeSlot(item.slot);
    if (!grouped[slot]) grouped[slot] = [];
    grouped[slot].push(item);
  }
  return grouped;
}

function setupControls() {
  els.gender.innerHTML = GENDERS.map((g) => `<option value="${g}">${capitalize(g)}</option>`).join('');
}

function bindGlobal() {
  els.gender.addEventListener('change', () => {
    state.gender = els.gender.value;
    renderAll();
    persist();
  });

  els.onlyBuyable.addEventListener('change', () => {
    state.onlyBuyable = Boolean(els.onlyBuyable.checked);
    dropUnavailableSelections();
    renderAll();
    persist();
  });

  els.onlyGiftShop.addEventListener('change', () => {
    state.onlyGiftShop = Boolean(els.onlyGiftShop.checked);
    dropUnavailableSelections();
    renderAll();
    persist();
  });

  els.randomizeBtn.addEventListener('click', randomizeSelection);
  els.clearBtn.addEventListener('click', clearSelection);
}

function renderSlots() {
  const slots = Object.keys(state.bySlot).sort((a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b));

  els.slots.innerHTML = slots.map((slot) => {
    const list = getFilteredSlotItems(slot, state.searchBySlot[slot] || '');
    return `
      <section class="slot" data-slot="${escapeHTML(slot)}">
        <div class="slot-head">
          <h3 class="slot-title">${escapeHTML(slot)}</h3>
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

    renderSlotList(slotEl, slot, getFilteredSlotItems(slot, state.searchBySlot[slot] || ''), state.searchBySlot[slot] || '');

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

    const icon = getItemIconUrl(slotNum, item.itemId);
    return `
      <button class="item-row${selected}" data-item-id="${item.itemId}" title="${escapeHTML(item.name)}" style="height:${VIRTUAL_ROW_HEIGHT}px">
        <span class="item-icon"><img src="${icon}" alt="icon" loading="lazy" /></span>
        <span class="item-name">${escapeHTML(item.name)}</span>
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
  dropUnavailableSelections();

  els.gender.value = state.gender;
  els.onlyBuyable.checked = state.onlyBuyable;
  els.onlyGiftShop.checked = state.onlyGiftShop;

  for (const slot of Object.keys(state.bySlot)) {
    const slotEl = els.slots.querySelector(`.slot[data-slot="${slot}"]`);
    if (!slotEl) continue;

    const query = state.searchBySlot[slot] || '';
    const filtered = getFilteredSlotItems(slot, query);

    renderSlotList(slotEl, slot, filtered, query);
    updateSlotCount(slotEl, filtered.length);
    renderSlotIcon(slotEl, slot);
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
  const itemId = Number(state.selected[slotNum] || 0);
  const img = icon.querySelector('img');

  if (!slotNum || !itemId) {
    img.src = '';
    img.style.display = 'none';
    return;
  }

  img.style.display = 'block';
  img.src = getItemIconUrl(slotNum, itemId);
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

    if (!locationEntries.length && !vanityEntries.length) {
      return `
        <div class="location-item">
          <div class="name">${escapeHTML(item.name)}</div>
          <div class="missing">No source found in master data.</div>
        </div>
      `;
    }

    let lines = '';
    for (const entry of locationEntries) {
      lines += `<div class="entry">${escapeHTML(entry.region || 'Unknown')} · ${escapeHTML(entry.city || 'Unknown')} · ${escapeHTML(entry.price || 'Unknown')}</div>`;
    }

    for (const entry of vanityEntries) {
      lines += `<div class="entry">${escapeHTML(entry.detail || 'Buyable')}</div>`;
    }

    const sources = new Set();
    for (const entry of locationEntries) if (entry.source) sources.add(entry.source);
    for (const entry of vanityEntries) if (entry.source) sources.add(entry.source);

    const sourceLinks = Array.from(sources)
      .map((src) => `<a href="${escapeHTML(src)}" target="_blank" rel="noopener noreferrer">Source</a>`)
      .join(' · ');

    return `
      <div class="location-item">
        <div class="name">${escapeHTML(item.name)}</div>
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

  els.health.innerHTML = `
    <strong>Data Health</strong>
    <span>Items: ${state.items.length}</span>
    <span>Unmatched locations: ${unmatchedLocations}</span>
    <span>Unmatched vanity: ${unmatchedVanity}</span>
    <span>Duplicates: ${duplicates}</span>
    <span>Missing slot: ${missingSlot}</span>
  `;
}

function getFilteredSlotItems(slot, query = '') {
  let list = state.bySlot[slot] || [];

  if (state.onlyBuyable) {
    list = list.filter((item) => isBuyable(item));
  }

  if (state.onlyGiftShop) {
    list = list.filter((item) => isGiftShop(item));
  }

  const q = normalizeName(query || '');
  if (q) {
    list = list.filter((item) => item.searchName.includes(q));
  }

  return list;
}

function isBuyable(item) {
  return Boolean(item?.buyable?.isBuyable || item?.tags?.includes('Buyable'));
}

function isGiftShop(item) {
  return Boolean(item?.giftShop?.isGiftShop || item?.tags?.includes('Gift Shop'));
}

function updateSlotCount(slotEl, count) {
  const countEl = slotEl.querySelector('.slot-count');
  if (countEl) countEl.textContent = `${count} items`;
}

function dropUnavailableSelections() {
  if (!state.onlyBuyable && !state.onlyGiftShop) return;

  for (const slot of Object.keys(state.bySlot)) {
    const slotNum = SLOT_TO_NUM[slot] || 0;
    if (!slotNum) continue;

    const selectedItemId = Number(state.selected[slotNum] || 0);
    if (!selectedItemId) continue;

    const selectedItem = state.itemByItemId[selectedItemId];
    if (!selectedItem) {
      state.selected[slotNum] = 0;
      continue;
    }

    if (state.onlyBuyable && !isBuyable(selectedItem)) {
      state.selected[slotNum] = 0;
      continue;
    }

    if (state.onlyGiftShop && !isGiftShop(selectedItem)) {
      state.selected[slotNum] = 0;
    }
  }
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
    onlyBuyable: state.onlyBuyable,
    onlyGiftShop: state.onlyGiftShop,
    searchBySlot: state.searchBySlot,
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
    state.onlyBuyable = Boolean(parsed.onlyBuyable);
    state.onlyGiftShop = Boolean(parsed.onlyGiftShop);
    state.searchBySlot = typeof parsed.searchBySlot === 'object' && parsed.searchBySlot ? parsed.searchBySlot : {};
  } catch {
  }
}

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle('error', isError);
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


