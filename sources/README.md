# Local Data Sources (Not Versioned)

Place optional source files here when you want enriched location/vanity metadata:

- `sources/vanity.json`
- `sources/locations.json`

These files are intentionally ignored by git.

Expected formats:

## vanity.json
```json
{
  "Classic Cap": [
    { "detail": "Gift Shop - 1000 RP", "source": "https://example.com" }
  ]
}
```

## locations.json
```json
{
  "Classic Cap": [
    { "region": "KANTO", "city": "Viridian City", "price": "300 Pokeyen", "source": "https://example.com" }
  ]
}
```

Importer behavior:
- Uses `SOURCE_VANITY_URL` / `SOURCE_LOCATIONS_URL` if set.
- Falls back to local files above.
- If both are missing, build continues with empty metadata.
