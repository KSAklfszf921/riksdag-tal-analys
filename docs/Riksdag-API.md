# Using the Swedish Parliament (Riksdagens) Speech API

This project fetches speeches from the Riksdagens open data API. Below is a short reference on how the API works.

## Base URL

```
http://data.riksdagen.se/anforandelista/
```

In production we use the HTTPS variant to avoid CORS issues. During development a Vite proxy forwards requests to this origin.

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
http://data.riksdagen.se/anforandelista/?sz=20&utformat=json
```

The response contains an `anforandelista` object with an array of `anforande` items. Each item includes fields such as `anforande_id`, `talare`, `parti`, `dok_datum`, `anforande_text` and `rm`.

Refer to [Riksdagens dokumentation](http://data.riksdagen.se/dokumentation/) for full details about available endpoints and parameters.

