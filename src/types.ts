export interface Analysis {
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
  wordCount?: number;
  content?: string;

}
