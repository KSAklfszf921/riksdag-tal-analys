import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const BASE_URL = 'https://data.riksdagen.se/anforandelista/';

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    params[key] = value;
  }
  return params;
}

function buildQuery(params) {
  const query = new URLSearchParams();
  query.append('utformat', 'json');
  query.append('doktyp', 'anf');
  query.append('sz', params.limit || '10');
  if (params.year) query.append('rm', params.year);
  if (params.party) query.append('parti', params.party);
  if (params.member) query.append('talare', params.member);
  if (params.searchTerm) query.append('sokord', params.searchTerm);
  if (params.from) query.append('from', params.from);
  if (params.tom) query.append('tom', params.tom);
  return query.toString();
}

async function fetchSpeeches(params) {
  const url = `${BASE_URL}?${buildQuery(params)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  const data = await res.json();
  const speeches = Array.isArray(data.anforandelista.anforande)
    ? data.anforandelista.anforande
    : [data.anforandelista.anforande];
  return speeches;
}

(async () => {
  const params = parseArgs();
  try {
    const speeches = await fetchSpeeches(params);
    if (speeches.length === 0) {
      console.log('No speeches found');
      return;
    }
    const outDir = path.resolve('downloaded_speeches');
    await fs.mkdir(outDir, { recursive: true });
    for (const speech of speeches) {
      const fileName = `${speech.talare.replace(/\s+/g, '_')}_${speech.dok_datum}.txt`;
      const filePath = path.join(outDir, fileName);
      await fs.writeFile(filePath, speech.anforande_text, 'utf8');
      console.log('Saved', filePath);
    }
    console.log(`Saved ${speeches.length} speeches to ${outDir}`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
