
export interface RiksdagAnforande {
  anforande_id: string;
  talare: string;
  parti: string;
  dok_datum: string;
  anforande_text: string;
  debatt_id: string;
  rm: string;
}

export interface RiksdagApiResponse {
  anforandelista: {
    anforande: RiksdagAnforande[];
    '@count': string;
    '@sida': string;
  };
}

export interface ApiSearchParams {
  year?: string;
  party?: string;
  member?: string;
  type?: string;
  limit?: string;
  searchTerm?: string;
  from?: string;
  tom?: string;
}

// Use a relative URL in development so we can proxy API requests to avoid CORS
// issues. In production we call the HTTPS endpoint directly.
const BASE_URL = import.meta.env.DEV
  ? '/riksdag-api/anforandelista/'
  : 'https://data.riksdagen.se/anforandelista/';

export const fetchRiksdagSpeeches = async (params: ApiSearchParams = {}): Promise<RiksdagAnforande[]> => {
  const queryParams = new URLSearchParams();
  
  // Standard parameters
  queryParams.append('utformat', 'json');
  queryParams.append('doktyp', 'anf');
  
  // Add optional parameters
  if (params.limit) {
    queryParams.append('sz', params.limit);
  } else {
    queryParams.append('sz', '10'); // Default to 10
  }
  
  if (params.year) {
    queryParams.append('rm', params.year);
  }
  
  if (params.party) {
    queryParams.append('parti', params.party);
  }
  
  if (params.member) {
    queryParams.append('talare', params.member);
  }
  
  if (params.searchTerm) {
    queryParams.append('sokord', params.searchTerm);
  }
  
  if (params.from) {
    queryParams.append('from', params.from);
  }
  
  if (params.tom) {
    queryParams.append('tom', params.tom);
  }

  const url = `${BASE_URL}?${queryParams.toString()}`;
  
  console.log('Fetching from Riksdag API:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: RiksdagApiResponse = await response.json();
    
    // Handle both single item and array responses
    const speeches = Array.isArray(data.anforandelista.anforande) 
      ? data.anforandelista.anforande 
      : [data.anforandelista.anforande];
    
    console.log(`Fetched ${speeches.length} speeches from Riksdag API`);
    
    return speeches.filter(speech => speech && speech.anforande_text);
  } catch (error) {
    console.error('Error fetching from Riksdag API:', error);
    throw new Error(`Failed to fetch speeches: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchLatestSpeeches = async (count: number = 10): Promise<RiksdagAnforande[]> => {
  return fetchRiksdagSpeeches({ limit: count.toString() });
};

export const searchSpeeches = async (searchParams: ApiSearchParams): Promise<RiksdagAnforande[]> => {
  return fetchRiksdagSpeeches(searchParams);
};
