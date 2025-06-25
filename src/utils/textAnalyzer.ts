
export interface AnalysisResult {
  id: string;
  fileName: string;
  speaker: string;
  party: string;
  date: Date;
  totalScore: number;
  scores: {
    lix: number;
    ovix: number;
    nk: number;
  };
  source?: string;
}

export const analyzeText = async (
  text: string, 
  fileName: string, 
  onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
  // Simulate analysis progress
  if (onProgress) onProgress(25);
  
  // Extract speaker and party from filename or text
  const speakerMatch = fileName.match(/^([^_]+)_([^_]+)/);
  const speaker = speakerMatch ? `${speakerMatch[1]} ${speakerMatch[2]}` : 'Okänd talare';
  const party = extractPartyFromText(text) || 'Okänt parti';
  
  if (onProgress) onProgress(50);
  
  // Calculate LIX (readability index)
  const lix = calculateLIX(text);
  
  if (onProgress) onProgress(75);
  
  // Calculate OVIX (word variation index)
  const ovix = calculateOVIX(text);
  
  // Calculate NK (nominal ratio)
  const nk = calculateNK(text);
  
  if (onProgress) onProgress(100);
  
  const totalScore = Math.round((lix + ovix + nk) / 3);
  
  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName,
    speaker,
    party,
    date: new Date(),
    totalScore,
    scores: {
      lix: Math.round(lix),
      ovix: Math.round(ovix),
      nk: Math.round(nk)
    }
  };
};

const calculateLIX = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const longWords = words.filter(w => w.length > 6);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const longWordPercentage = (longWords.length / words.length) * 100;
  
  return avgWordsPerSentence + longWordPercentage;
};

const calculateOVIX = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words);
  
  if (words.length === 0) return 0;
  
  const logTokens = Math.log(words.length);
  const logTypes = Math.log(uniqueWords.size);
  
  return (logTokens / (2 - (logTypes / logTokens))) * 100;
};

const calculateNK = (text: string): number => {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  // Simplified nominal ratio calculation
  const nominals = words.filter(w => 
    /^[A-ZÅÄÖ]/.test(w) || // Capitalized words
    w.endsWith('ning') || w.endsWith('het') || w.endsWith('dom') // Common nominal endings
  );
  
  if (words.length === 0) return 0;
  
  return (nominals.length / words.length) * 100;
};

const extractPartyFromText = (text: string): string | null => {
  const parties = ['S', 'M', 'SD', 'C', 'V', 'KD', 'L', 'MP'];
  const partyPattern = new RegExp(`\\b(${parties.join('|')})\\b`, 'i');
  const match = text.match(partyPattern);
  return match ? match[1].toUpperCase() : null;
};
