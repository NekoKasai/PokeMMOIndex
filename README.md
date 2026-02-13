# PokeMMOHelper

Unofficial community tools for PokeMMO - starting with a **Cosmetics Helper** (try-on, filters, and shop locations).

> **Not affiliated with PokeMMO.**
> This is a fan-made project and is not endorsed by the PokeMMO team.

---

## Live

- GitHub Pages: https://nekokasai.github.io/PokeMMOHelper/

---

## Features

### Cosmetics Helper
- Slot-based cosmetic selection
- Tag filters (Event, Seasonal, Limited, Mart Items, Gift Shop, etc.)
- "Where to get it" location panel
- Deterministic IDs + normalization (robust matching across sources)
- Data health reporting (unmatched / duplicates / missing slots)

---

## Data Import (script-based)

This project intentionally avoids maintaining large aggregated datasets as hand-edited source files.
Instead, data is generated via an importer script that pulls from publicly accessible sources and builds a local master dataset for the website.

### Generate data locally

```bash
node tools/import-data.mjs
```

Generated outputs:
- `dist/data/cosmetics.master.json`
- `dist/data/build-report.json`
- `dist/data/cosmetics.master.js`
- `dist/data/build-report.js`

---

## Run locally

Use a local web server (because `fetch()` is not reliable with `file://`).

```bash
# Option A
npx serve dist

# Option B
python -m http.server 8080 --directory dist
```

Open `http://localhost:8080`.

---

## Development notes

- Plain HTML/CSS/JS (no framework).
- App reads data from `./data/cosmetics.master.json` and `./data/build-report.json`.
- If JSON fetch fails, the app can fall back to `window.COSMETICS_MASTER` / `window.BUILD_REPORT` if wrappers are present.
- Optional dev-only remote fallback: add `?dev=1` to URL.

---

## Data Notice

The code in this repository is open source under `LICENSE`.
Data and content referenced or derived from third-party sources may have separate terms and are not automatically covered by this repository's license.

If you are a rights holder and want data adjusted or removed, open an issue.

---

## Attribution / Sources

This tool builds on publicly accessible community resources, including:
- PokeMMO Hub and its open-source ecosystem: https://pokemmohub.com/
- PokeMMO Hub GitHub: https://github.com/PokeMMO-Tools/pokemmo-hub
- Community guides and indexes posted on the PokeMMO forums.

See `tools/import-data.mjs` for exact source URLs used.

---

## License

See `LICENSE`.
