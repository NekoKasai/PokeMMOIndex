# PokeMMO Helper - Cosmetics (Clean Rebuild)

A clean vanilla HTML/CSS/JS cosmetics helper for PokeMMO with deterministic IDs, unified master data, and data health reporting.

## Features

- Deterministic cosmetic IDs via name normalization
- Unified `cosmetics.master.json` as single source of truth
- Buyable and Gift Shop filters
- Gender + multi-view preview integration
- Data health status (items/unmatched/duplicates/missing slot)
- Local build pipeline for merge/report generation

## Project Structure

- `index.html` - UI layout
- `styles.css` - page styling
- `app.js` - app state, filters, rendering
- `data-utils.js` - normalization + ID utilities
- `cosmetics.master.json` - generated master dataset
- `build-report.json` - generated health report
- `tools/build-master.mjs` - build script for master/report generation

## Run Locally

Open `index.html` through a local static server (recommended), e.g. VS Code Live Server.

## Rebuild Master Data

Requirements:
- Node.js 18+

Run:

```bash
node tools/build-master.mjs
```

This regenerates:
- `cosmetics.master.json`
- `build-report.json`

## Data Sources

- PokeMMO Hub: https://pokemmohub.com/
- PokeMMO Hub GitHub: https://github.com/PokeMMO-Tools/pokemmo-hub
- Vanity Wiki: https://pokemmo.shoutwiki.com/wiki/Vanity
- Vanity Index Forum: https://forums.pokemmo.com/index.php?/topic/145375-pokemmo-vanity-index/
- Finding Cosmetics Guide: https://forums.pokemmo.com/index.php?/topic/85492-finding-cosmetics-guide/

## Repository

- Target repository: https://github.com/NekoKasai/PokeMMOHelper
