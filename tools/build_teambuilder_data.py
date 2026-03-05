#!/usr/bin/env python3
import json
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

BASE = "https://pokeapi.co/api/v2"
GEN5_MAX_POKEMON_ID = 649
GEN5_MAX_MOVE_ID = 559
ALLOWED_VERSION_GROUPS = {
    "red-blue",
    "yellow",
    "gold-silver",
    "crystal",
    "ruby-sapphire",
    "emerald",
    "firered-leafgreen",
    "diamond-pearl",
    "platinum",
    "heartgold-soulsilver",
    "black-white",
    "black-2-white-2",
}


def fetch_json(url: str, retries: int = 5, timeout: int = 30):
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PokeMMOIndex/1.0",
                    "Accept": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as err:
            last_err = err
            time.sleep(0.3 * (attempt + 1))
    raise RuntimeError(f"Request failed: {url} ({last_err})")


def cap_type(s: str) -> str:
    return s[:1].upper() + s[1:].lower() if s else ""


def cap_name(s: str) -> str:
    return s[:1].upper() + s[1:] if s else ""


def ability_de_fallback(en: str) -> str:
    return " ".join(part[:1].upper() + part[1:] for part in (en or "").split("-"))


def fetch_species_de_name(pid: int):
    data = fetch_json(f"{BASE}/pokemon-species/{pid}")
    for n in data.get("names", []):
        lang = n.get("language", {}).get("name")
        if lang == "de":
            return pid, n.get("name")
    return pid, None


def fetch_pokemon_entry(pid: int, de_name_map):
    d = fetch_json(f"{BASE}/pokemon/{pid}")
    en_name = cap_name(d.get("name", ""))
    de_name = de_name_map.get(pid) or en_name

    types = [
        cap_type(t.get("type", {}).get("name", ""))
        for t in sorted(d.get("types", []), key=lambda x: x.get("slot", 0))
    ]
    types = [t for t in types if t] or ["Normal"]

    stats = {"hp": 50, "atk": 50, "def": 50, "spa": 50, "spd": 50, "spe": 50}
    stat_map = {
        "hp": "hp",
        "attack": "atk",
        "defense": "def",
        "special-attack": "spa",
        "special-defense": "spd",
        "speed": "spe",
    }
    for s in d.get("stats", []):
        key = stat_map.get(s.get("stat", {}).get("name"))
        if key:
            stats[key] = int(s.get("base_stat", 0))

    learn_move_ids = []
    for mv in d.get("moves", []):
        details = mv.get("version_group_details", [])
        if any(x.get("version_group", {}).get("name") in ALLOWED_VERSION_GROUPS for x in details):
            name = mv.get("move", {}).get("name")
            if name:
                learn_move_ids.append(name)

    abilities = []
    for a in d.get("abilities", []):
        en = a.get("ability", {}).get("name", "")
        abilities.append(
            {
                "en": en,
                "de": ability_de_fallback(en),
                "isHidden": bool(a.get("is_hidden")),
            }
        )

    return {
        "id": pid,
        "name": de_name,
        "englishName": en_name,
        "types": types,
        "stats": stats,
        "learnMoveIds": learn_move_ids,
        "abilities": abilities,
    }


def fetch_move_entry(mid: int, fallback_name: str):
    d = fetch_json(f"{BASE}/move/{mid}")
    de_name = None
    for n in d.get("names", []):
        if n.get("language", {}).get("name") == "de":
            de_name = n.get("name")
            break
    name = d.get("name") or fallback_name
    if not de_name:
        de_name = cap_name((name or fallback_name).replace("-", " "))
    return {
        "id": int(d.get("id") or mid),
        "name": name,
        "name_de": de_name,
        "type": cap_type(d.get("type", {}).get("name", "")) or "Normal",
        "power": int(d.get("power") or 0),
        "acc": int(d.get("accuracy") or 0),
        "pp": int(d.get("pp") or 0),
        "cat": d.get("damage_class", {}).get("name", "") or "",
    }


def main():
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    print("Fetch species de names...")
    de_name_map = {}
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = [ex.submit(fetch_species_de_name, pid) for pid in range(1, GEN5_MAX_POKEMON_ID + 1)]
        for idx, fut in enumerate(as_completed(futures), 1):
            pid, name = fut.result()
            if name:
                de_name_map[pid] = name
            if idx % 100 == 0:
                print(f"  species: {idx}/{GEN5_MAX_POKEMON_ID}")

    print("Fetch pokemon details...")
    pokemon = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = [ex.submit(fetch_pokemon_entry, pid, de_name_map) for pid in range(1, GEN5_MAX_POKEMON_ID + 1)]
        for idx, fut in enumerate(as_completed(futures), 1):
            pokemon.append(fut.result())
            if idx % 100 == 0:
                print(f"  pokemon: {idx}/{GEN5_MAX_POKEMON_ID}")
    pokemon.sort(key=lambda x: x["id"])

    print("Fetch move list...")
    move_list = fetch_json(f"{BASE}/move?limit=2000").get("results", [])
    base_moves = []
    for m in move_list:
        url = m.get("url", "")
        parts = [p for p in url.split("/") if p]
        if not parts:
            continue
        mid = int(parts[-1])
        if 1 <= mid <= GEN5_MAX_MOVE_ID:
            base_moves.append((mid, m.get("name", "")))
    base_moves.sort(key=lambda x: x[0])

    print("Fetch move details...")
    moves = []
    with ThreadPoolExecutor(max_workers=14) as ex:
        futures = [ex.submit(fetch_move_entry, mid, name) for mid, name in base_moves]
        for idx, fut in enumerate(as_completed(futures), 1):
            moves.append(fut.result())
            if idx % 100 == 0:
                print(f"  moves: {idx}/{len(base_moves)}")
    moves.sort(key=lambda x: x["id"])

    pokemon_path = out_dir / "teambuilder.pokemon.gen5.json"
    moves_path = out_dir / "teambuilder.moves.gen5.json"
    pokemon_path.write_text(json.dumps(pokemon, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    moves_path.write_text(json.dumps(moves, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {pokemon_path} ({pokemon_path.stat().st_size} bytes)")
    print(f"Wrote {moves_path} ({moves_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
