# Using the Swedish Parliament (Riksdagens) Speech API

This project fetches speeches from the Riksdagens open data API. Below is a short reference on how the API works.

## Base URL

```

## Common Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `anforande_id` | Unique ID for a speech | `H809123-1` |
| `sz` | Number of results per page (max 500) | `20` |
| `doktyp` | Document type, for speeches use `anf` | `anf` |
| `rm` | Parliamentary year | `2022/23` |
| `from` | Start date (YYYY-MM-DD) | `2023-01-01` |
| `tom` | End date (YYYY-MM-DD) | `2023-12-31` |
| `parti` | Filter by party | `S` |
| `talare` | Filter by speaker name | `Anna Andersson` |
| `utformat` | Response format (`xml`, `json`, `csv`) | `json` |
| `sokord` | Search for words in speech text | `klimat` |

## Example Request

Fetch the latest 20 speeches in JSON format:

```

```

The response contains an `anforandelista` object with an array of `anforande` items. Each item includes fields such as `anforande_id`, `talare`, `parti`, `dok_datum`, `anforande_text` and `rm`.



