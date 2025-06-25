export interface Speech {
  anforande_id: string;
  talare: string;
  parti: string;
  dok_datum: string;
  anforande_text: string;
  debatt_id: string;
  rm: string;
}

export interface ApiResponse {
  anforandelista: {
    anforande: Speech[] | Speech;
    '@count': string;
    '@sida': string;
  };
}

export interface SearchParams {
  limit?: number;
  year?: string;
  party?: string;
  member?: string;
  search?: string;
  from?: string;
  to?: string;
}


const BASE_URL = import.meta.env.DEV ? '/riksdag-api/anforandelista/' : HTTP_BASE;

const buildQuery = (params: SearchParams): string => {
  const q = new URLSearchParams({ utformat: 'json', doktyp: 'anf' });

  if (params.limit) q.append('sz', params.limit.toString());
  if (params.year) q.append('rm', params.year);
  if (params.party) q.append('parti', params.party);
  if (params.member) q.append('talare', params.member);
  if (params.search) q.append('sokord', params.search);
  if (params.from) q.append('from', params.from);
  if (params.to) q.append('tom', params.to);

  return `${BASE_URL}?${q.toString()}`;
};

const fetchSpeeches = async (params: SearchParams = {}): Promise<Speech[]> => {
  const url = buildQuery(params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Riksdag API error: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  const list = data.anforandelista.anforande;
  const speeches = Array.isArray(list) ? list : [list];
  return speeches.filter((s) => s && s.anforande_text);
};

export const fetchLatestSpeeches = async (count = 10): Promise<Speech[]> => {
  return fetchSpeeches({ limit: count });
};

export const searchSpeeches = async (params: SearchParams): Promise<Speech[]> => {
  return fetchSpeeches(params);
};
