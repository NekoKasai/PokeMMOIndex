(function () {
  function normalizeName(name) {
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

  globalThis.normalizeName = normalizeName;
  globalThis.toCosmeticId = toCosmeticId;
  globalThis.normalizeSlot = normalizeSlot;
})();

