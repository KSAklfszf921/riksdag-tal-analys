
export interface AnalysisResult {
  id: string;
  fileName: string;
  speaker?: string;
  party?: string;
  date: Date;
  totalScore: number;
  scores: {
    lix: number;
    ovix: number;
    nk: number;
    wordLength: number;
    sentenceLength: number;
    uniqueWords: number;
    subordinateClauses: number;
    passiveVoice: number;
    conjunctions: number;
    sentiment: number;
    abstraction: number;
    modality: number;
    questions: number;
    metaphors: number;
    textLength: number;
    paragraphStructure: number;
    repetition: number;
    sparvScore: number;
    coherenceScore: number;
    fluencyScore: number;
  };
  wordCount: number;
  source?: string;
}

export const analyzeText = async (
  text: string, 
  fileName: string, 
  progressCallback?: (progress: number) => void
): Promise<AnalysisResult> => {
  const methods = [
    'LIX (Läsbarhet)',
    'OVIX (Ordvariation)', 
    'Nominalkvot',
    'Ordlängd',
    'Meningslängd',
    'Unika ord',
    'Bisatsfrekvens',
    'Passiv röst',
    'Konjunktioner',
    'Sentiment',
    'Abstraktion',
    'Modalitet',
    'Frågor',
    'Metaforer',
    'Textlängd',
    'Styckestruktur',
    'Repetition',
    'Sparv API',
    'Coherence Score',
    'Fluency Score'
  ];

  // Extract speaker and party information
  const speakerMatch = text.match(/Anf\.\s*\d+\s+([^(]+)\s*\(([^)]+)\)/);
  const speaker = speakerMatch ? speakerMatch[1].trim() : null;
  const party = speakerMatch ? speakerMatch[2].trim() : null;

  // Clean text for analysis
  const cleanText = text.replace(/Anf\.\s*\d+\s+[^(]+\([^)]+\)/, '').trim();

  const scores = {
    lix: 0,
    ovix: 0,
    nk: 0,
    wordLength: 0,
    sentenceLength: 0,
    uniqueWords: 0,
    subordinateClauses: 0,
    passiveVoice: 0,
    conjunctions: 0,
    sentiment: 0,
    abstraction: 0,
    modality: 0,
    questions: 0,
    metaphors: 0,
    textLength: 0,
    paragraphStructure: 0,
    repetition: 0,
    sparvScore: 0,
    coherenceScore: 0,
    fluencyScore: 0
  };

  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    progressCallback?.((i / methods.length) * 100);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    switch (method) {
      case 'LIX (Läsbarhet)':
        scores.lix = calculateLIX(cleanText);
        break;
      case 'OVIX (Ordvariation)':
        scores.ovix = calculateOVIX(cleanText);
        break;
      case 'Nominalkvot':
        scores.nk = calculateNK(cleanText);
        break;
      case 'Ordlängd':
        scores.wordLength = calculateAverageWordLength(cleanText);
        break;
      case 'Meningslängd':
        scores.sentenceLength = calculateAverageSentenceLength(cleanText);
        break;
      case 'Unika ord':
        scores.uniqueWords = calculateUniqueWords(cleanText);
        break;
      case 'Bisatsfrekvens':
        scores.subordinateClauses = calculateSubordinateClauses(cleanText);
        break;
      case 'Passiv röst':
        scores.passiveVoice = calculatePassiveVoice(cleanText);
        break;
      case 'Konjunktioner':
        scores.conjunctions = calculateConjunctions(cleanText);
        break;
      case 'Sentiment':
        scores.sentiment = calculateSentiment(cleanText);
        break;
      case 'Abstraktion':
        scores.abstraction = calculateAbstraction(cleanText);
        break;
      case 'Modalitet':
        scores.modality = calculateModality(cleanText);
        break;
      case 'Frågor':
        scores.questions = calculateQuestions(cleanText);
        break;
      case 'Metaforer':
        scores.metaphors = calculateMetaphors(cleanText);
        break;
      case 'Textlängd':
        scores.textLength = calculateTextLength(cleanText);
        break;
      case 'Styckestruktur':
        scores.paragraphStructure = calculateParagraphStructure(cleanText);
        break;
      case 'Repetition':
        scores.repetition = calculateRepetition(cleanText);
        break;
      case 'Sparv API':
        scores.sparvScore = await calculateSparvScore(cleanText);
        break;
      case 'Coherence Score':
        scores.coherenceScore = calculateCoherenceScore(cleanText);
        break;
      case 'Fluency Score':
        scores.fluencyScore = calculateFluencyScore(cleanText);
        break;
    }
  }

  progressCallback?.(100);

  const totalScore = calculateTotalScore(scores);
  const wordCount = cleanText.split(/\s+/).length;

  return {
    id: Date.now().toString(),
    fileName,
    speaker,
    party,
    date: new Date(),
    totalScore,
    scores,
    wordCount,
    source: 'upload'
  };
};

// Individual calculation functions
const calculateLIX = (text: string): number => {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 1;
  
  const longWords = words.filter(word => 
    word.replace(/[^a-zA-ZåäöÅÄÖ]/g, '').length > 6
  ).length;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const longWordPercentage = (longWords / words.length) * 100;
  
  const lix = avgWordsPerSentence + longWordPercentage;
  return Math.max(1, Math.min(50, Math.round(lix * 0.8))); // Scale to 1-50
};

const calculateOVIX = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const uniqueWords = new Set(words).size;
  
  if (words.length === 0) return 1;
  
  const ovix = (Math.log(words.length) / Math.log(2 - (uniqueWords / words.length))) * 100;
  return Math.max(1, Math.min(50, Math.round(ovix * 0.5))); // Scale to 1-50
};

const calculateNK = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/);
  
  // Simplified noun/verb ratio estimation
  const nounIndicators = ['het', 'ning', 'dom', 'skap', 'else', 'tion'];
  const verbIndicators = ['ar', 'er', 'ade', 'at', 'it', 'ut'];
  
  let nouns = 0;
  let verbs = 0;
  
  words.forEach(word => {
    if (nounIndicators.some(ending => word.endsWith(ending))) nouns++;
    if (verbIndicators.some(ending => word.endsWith(ending))) verbs++;
  });
  
  const nk = verbs > 0 ? (nouns / verbs) * 100 : 50;
  return Math.max(1, Math.min(50, Math.round(nk)));
};

const calculateAverageWordLength = (text: string): number => {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const totalLength = words.reduce((sum, word) => sum + word.replace(/[^a-zA-ZåäöÅÄÖ]/g, '').length, 0);
  const avgLength = words.length > 0 ? totalLength / words.length : 0;
  return Math.max(1, Math.min(50, Math.round(avgLength * 8))); // Scale to 1-50
};

const calculateAverageSentenceLength = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  const avgLength = sentences.length > 0 ? words.length / sentences.length : 0;
  return Math.max(1, Math.min(50, Math.round(avgLength * 2))); // Scale to 1-50
};

const calculateUniqueWords = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const uniqueWords = new Set(words).size;
  const ratio = words.length > 0 ? (uniqueWords / words.length) * 100 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculateSubordinateClauses = (text: string): number => {
  const subordinateMarkers = ['att', 'som', 'när', 'där', 'vilket', 'vilken', 'eftersom', 'medan'];
  const sentences = text.split(/[.!?]+/);
  let subordinateClauses = 0;
  
  sentences.forEach(sentence => {
    subordinateMarkers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      const matches = sentence.match(regex);
      if (matches) subordinateClauses += matches.length;
    });
  });
  
  const ratio = sentences.length > 0 ? (subordinateClauses / sentences.length) * 100 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculatePassiveVoice = (text: string): number => {
  const passiveMarkers = ['blev', 'blir', 'blivit', 'varit', 'gjorts', 'sagts', 'beslutats'];
  const words = text.toLowerCase().split(/\s+/);
  
  let passiveCount = 0;
  passiveMarkers.forEach(marker => {
    passiveCount += words.filter(word => word.includes(marker)).length;
  });
  
  const ratio = words.length > 0 ? (passiveCount / words.length) * 1000 : 0; // Per 1000 words
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculateConjunctions = (text: string): number => {
  const conjunctions = ['och', 'men', 'eller', 'utan', 'för', 'så', 'då', 'eftersom', 'därför', 'medan'];
  const words = text.toLowerCase().split(/\s+/);
  
  let conjunctionCount = 0;
  conjunctions.forEach(conj => {
    conjunctionCount += words.filter(word => word === conj).length;
  });
  
  const ratio = words.length > 0 ? (conjunctionCount / words.length) * 100 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio * 10)));
};

const calculateSentiment = (text: string): number => {
  const positiveWords = ['bra', 'bättre', 'viktigt', 'framgång', 'positivt', 'utveckling', 'möjlighet'];
  const negativeWords = ['problem', 'fel', 'kris', 'svårt', 'negativt', 'hot', 'risk'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    positiveCount += words.filter(w => w.includes(word)).length;
  });
  
  negativeWords.forEach(word => {
    negativeCount += words.filter(w => w.includes(word)).length;
  });
  
  const sentiment = (positiveCount - negativeCount) / words.length;
  return Math.max(1, Math.min(50, Math.round((sentiment + 0.1) * 250))); // Scale to 1-50
};

const calculateAbstraction = (text: string): number => {
  const abstractWords = ['demokrati', 'rättvisa', 'frihet', 'ansvar', 'princip', 'värde', 'begrepp'];
  const concreteWords = ['hus', 'bil', 'pengar', 'arbete', 'skola', 'sjukhus', 'väg'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let abstractCount = 0;
  let concreteCount = 0;
  
  abstractWords.forEach(word => {
    abstractCount += words.filter(w => w.includes(word)).length;
  });
  
  concreteWords.forEach(word => {
    concreteCount += words.filter(w => w.includes(word)).length;
  });
  
  const total = abstractCount + concreteCount;
  const ratio = total > 0 ? (abstractCount / total) * 100 : 50;
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculateModality = (text: string): number => {
  const modalWords = ['kanske', 'möjligen', 'troligen', 'antagligen', 'förmodligen', 'skulle', 'kunde', 'borde'];
  const words = text.toLowerCase().split(/\s+/);
  
  let modalCount = 0;
  modalWords.forEach(modal => {
    modalCount += words.filter(word => word === modal).length;
  });
  
  const ratio = words.length > 0 ? (modalCount / words.length) * 1000 : 0; // Per 1000 words
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculateQuestions = (text: string): number => {
  const questions = text.split('?').length - 1;
  const sentences = text.split(/[.!?]+/).length;
  
  const ratio = sentences > 0 ? (questions / sentences) * 100 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio * 5)));
};

const calculateMetaphors = (text: string): number => {
  const metaphorMarkers = ['som en', 'liknar', 'påminner om', 'är som', 'fungerar som'];
  let metaphorCount = 0;
  
  metaphorMarkers.forEach(marker => {
    const regex = new RegExp(marker, 'gi');
    const matches = text.match(regex);
    if (matches) metaphorCount += matches.length;
  });
  
  const words = text.split(/\s+/).length;
  const ratio = words > 0 ? (metaphorCount / words) * 1000 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio)));
};

const calculateTextLength = (text: string): number => {
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Score based on optimal length (500-2000 words)
  if (words < 100) return Math.round(words / 4); // Very short
  if (words < 500) return Math.round(words / 10); // Short
  if (words <= 2000) return 50; // Optimal
  if (words <= 5000) return Math.max(25, 50 - Math.round((words - 2000) / 100)); // Long
  return Math.max(1, 25 - Math.round((words - 5000) / 200)); // Very long
};

const calculateParagraphStructure = (text: string): number => {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (paragraphs.length === 0) return 1;
  
  const avgSentencesPerParagraph = sentences.length / paragraphs.length;
  
  // Optimal: 3-8 sentences per paragraph
  if (avgSentencesPerParagraph >= 3 && avgSentencesPerParagraph <= 8) return 50;
  if (avgSentencesPerParagraph >= 2 && avgSentencesPerParagraph <= 10) return 35;
  return Math.max(1, Math.min(50, Math.round(25 - Math.abs(avgSentencesPerParagraph - 5.5) * 3)));
};

const calculateRepetition = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const wordCount = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const repeatedWords = Object.values(wordCount).filter(count => count > 1).length;
  const ratio = words.length > 0 ? (repeatedWords / words.length) * 100 : 0;
  
  // Optimal repetition: 10-20%
  if (ratio >= 10 && ratio <= 20) return 50;
  return Math.max(1, Math.min(50, Math.round(50 - Math.abs(ratio - 15) * 2)));
};

const calculateSparvScore = async (text: string): Promise<number> => {
  // Simulate Sparv API call
  // In real implementation, this would call the actual Sparv API
  return Math.floor(Math.random() * 50) + 1;
};

const calculateCoherenceScore = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const cohesiveMarkers = ['dessutom', 'därför', 'således', 'å andra sidan', 'samtidigt', 'dock', 'emellertid'];
  
  let cohesiveCount = 0;
  sentences.forEach(sentence => {
    cohesiveMarkers.forEach(marker => {
      if (sentence.toLowerCase().includes(marker)) cohesiveCount++;
    });
  });
  
  const ratio = sentences.length > 0 ? (cohesiveCount / sentences.length) * 100 : 0;
  return Math.max(1, Math.min(50, Math.round(ratio * 5)));
};

const calculateFluencyScore = (text: string): number => {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Simple fluency estimate based on variation in sentence length
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  
  // Good fluency has moderate variation (not too uniform, not too chaotic)
  const fluencyScore = Math.max(0, 50 - Math.abs(variance - 25));
  return Math.max(1, Math.min(50, Math.round(fluencyScore)));
};

const calculateTotalScore = (scores: any): number => {
  const weights = {
    high: 1.5,   // LIX, OVIX, Meningslängd, Sparv-poäng
    normal: 1.0, // 13 methods
    low: 0.5     // 6 methods
  };

  const weightedScores = {
    // High weight methods
    lix: scores.lix * weights.high,
    ovix: scores.ovix * weights.high,
    sentenceLength: scores.sentenceLength * weights.high,
    sparvScore: scores.sparvScore * weights.high,
    
    // Normal weight methods
    nk: scores.nk * weights.normal,
    wordLength: scores.wordLength * weights.normal,
    subordinateClauses: scores.subordinateClauses * weights.normal,
    conjunctions: scores.conjunctions * weights.normal,
    sentiment: scores.sentiment * weights.normal,
    abstraction: scores.abstraction * weights.normal,
    textLength: scores.textLength * weights.normal,
    coherenceScore: scores.coherenceScore * weights.normal,
    fluencyScore: scores.fluencyScore * weights.normal,
    
    // Low weight methods  
    uniqueWords: scores.uniqueWords * weights.low,
    passiveVoice: scores.passiveVoice * weights.low,
    modality: scores.modality * weights.low,
    questions: scores.questions * weights.low,
    metaphors: scores.metaphors * weights.low,
    paragraphStructure: scores.paragraphStructure * weights.low,
    repetition: scores.repetition * weights.low
  };

  const totalWeightedScore = Object.values(weightedScores).reduce((sum: number, score: number) => sum + score, 0);
  
  // Maximum possible score: (4 * 50 * 1.5) + (9 * 50 * 1.0) + (7 * 50 * 0.5) = 300 + 450 + 175 = 925
  const maxPossibleScore = (4 * 50 * weights.high) + (9 * 50 * weights.normal) + (7 * 50 * weights.low);
  
  // Normalize to 0-100 scale
  let normalizedScore = (totalWeightedScore / maxPossibleScore) * 100;
  
  // Apply logistic transformation for realistic distribution
  // This ensures most scores fall in the 30-70 range with few extremes
  const logisticScore = 100 / (1 + Math.exp(-0.1 * (normalizedScore - 50)));
  
  // Final adjustment to ensure proper distribution:
  // - Very few scores above 80 (about 5%)
  // - Almost no scores above 90 (about 1%) 
  // - Very few scores below 20 (about 1%)
  let finalScore = logisticScore;
  
  if (finalScore > 75) {
    finalScore = 75 + (finalScore - 75) * 0.3; // Compress high scores
  }
  
  if (finalScore < 25) {
    finalScore = 25 - (25 - finalScore) * 0.5; // Compress low scores less severely
  }
  
  return Math.max(1, Math.min(100, Math.round(finalScore)));
};
