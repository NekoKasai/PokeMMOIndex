# PokeMMOIndex

Inoffizielle Community-Tools für PokeMMO – eine wachsende Sammlung aus Hilfstools, Guides und Referenzseiten.

> **Nicht mit PokeMMO verbunden.**
> Dieses Projekt ist ein Fan-Projekt und wird nicht vom PokeMMO-Team unterstützt.

---

## Live

- GitHub Pages: https://nekokasai.github.io/PokeMMOIndex/

---

## Seiten & Features

### Startseite (`index.html`)
- Übersicht aller verfügbaren Tools und Seiten
- Sprachauswahl (DE / EN)

### Kosmetik (`cosmetics.html`)
- Slot-basierte Kosmetik-Auswahl
- Tag-Filter (Event, Saisonal, Limited, Mart Items, Gift Shop usw.)
- „Wo bekomme ich es?"-Panel
- Deterministische IDs + Normalisierung
- Daten-Health-Report (fehlend / Duplikate / falscher Slot)

### Kalender (`calendar.html`)
- Roaming-Kalender: Welches Legendäre ist wann aktiv?
- Monatsübersicht mit regionaler Zuordnung

### Anleitungen (`guides.html`)
- Alpha-Guide, Schwarm-Guide, Rematch-Guide, EV- & Level-Guide
- IVs, EVs & Wesen, Zucht-Guide, Ho-Oh Rematch, Sevii Islands
- Aufklappbare Akkordeon-Abschnitte, zweisprachig (DE / EN)

### Legendäre Guide (`LegendäreGuide.html`)
- Vollständige Übersicht zu Mechaniken, Kategorien und Spawn-Bedingungen
- Roaming-Legendäre (Kanto/Johto) mit Monatsrotation
- KOTH-Legendäre mit Besitz- und Fangregeln
- Pokédex-Legendäre und Event-/Raid-Legendäre
- Abschnitt 7: Tipps, Tricks und Vorbereitung (Akkordeon)
- Aufklappbares Inhaltsverzeichnis
- Quellenverweise auf Forum-Raid-Guides

### Zucht (`breeding.html`)
- Zucht-Grundlagen und Regelübersicht

### Team Builder (`teambuilder.html` / `builder2.html`)
- Team-Planung mit Gen-5-Daten (Pokémon, Moves, Items)

---

## Navigation

Alle Seiten verwenden eine einheitliche Header-Navigation mit PNG-Icons aus dem `assets/`-Ordner:

| Icon | Seite |
|---|---|
| `startseite.png` | Startseite |
| `Kosmetic.png` | Kosmetik |
| `Kalender.png` | Kalender |
| `Anleitungen.png` | Anleitungen |
| `Legendäre.png` | Legendäre Guide |
| `Zucht.png` | Zucht |
| `Teambuilder.png` | Team Builder |
| `Github.png` | GitHub |

---

## Daten

Große aggregierte Quelldatensätze werden **nicht** als manuell bearbeitete Repo-Quelldateien gepflegt.
Daten werden durch Import-Skripte zur Build-Zeit generiert.

Generierte Ausgaben:
- `dist/data/cosmetics.master.json`
- `dist/data/build-report.json`

---

## Import

```bash
node tools/import-data.mjs
```

Optional:

```bash
node tools/import-data.mjs --allow-partial
```

---

## Lokaler Start

```bash
npx serve .
# oder
python -m http.server 8080
```

Öffne `http://localhost:8080`.

---

## GitHub Pages Deploy

Workflow: `.github/workflows/pages.yml`

- Führt `node tools/import-data.mjs --allow-partial` aus
- Lädt `dist/` als Pages-Artifact hoch
- Optionale Repo-Variablen:
  - `SOURCE_VANITY_URL`
  - `SOURCE_LOCATIONS_URL`

---

## Lizenz & Quellen

Code ist unter der Lizenz dieses Repositories (`LICENSE`) veröffentlicht.
Drittanbieter-Inhalte (Quell-Daten, Sprites, Forum-Guides) unterliegen ggf. separaten Bedingungen.

- PokeMMO Hub: https://pokemmohub.com/
- PokeMMO Hub GitHub: https://github.com/PokeMMO-Tools/pokemmo-hub
- The Ultimate Legendary Guide: https://forums.pokemmo.com/index.php?/topic/187603-the-ultimate-legendary-guide/
- Community-Guides und Indizes auf PokeMMO-Forum/Wiki

Bei Fragen zu Inhalten bitte ein Issue eröffnen.

