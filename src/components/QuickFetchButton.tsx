
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchLatestSpeeches } from '@/utils/riksdagApi';
import { analyzeText } from '@/utils/textAnalyzer';

interface QuickFetchButtonProps {
  onAnalysisComplete: (analysis: any) => void;
}

const QuickFetchButton = ({ onAnalysisComplete }: QuickFetchButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuickFetch = async () => {
    setIsLoading(true);
    toast({
      title: "Hämtar anföranden",
      description: "Hämtar de senaste anförandena från Riksdagens API...",
    });

    try {
      const speeches = await fetchLatestSpeeches(10);
      
      if (speeches.length === 0) {
        toast({
          title: "Inga anföranden hittades",
          description: "API:et returnerade inga resultat",
          variant: "destructive",
        });
        return;
      }

      // Analyze each speech
      for (const speech of speeches) {
        const fileName = `${speech.talare}_${speech.dok_datum}.txt`;
        const analysis = await analyzeText(speech.anforande_text, fileName);
        
        // Update analysis with real data from API
        const updatedAnalysis = {
          ...analysis,
          id: speech.anforande_id,
          speaker: speech.talare,
          party: speech.parti,
          date: new Date(speech.dok_datum),
          source: 'riksdag-api'
        };
        
        onAnalysisComplete(updatedAnalysis);
      }

      toast({
        title: "Hämtning slutförd",
        description: `${speeches.length} anföranden har hämtats och analyserats`,
      });
    } catch (error) {
      console.error('API fetch error:', error);
      toast({
        title: "Fel vid hämtning",
        description: error instanceof Error ? error.message : "Ett okänt fel uppstod",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleQuickFetch}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Download className="h-4 w-4 mr-2" />
      {isLoading ? 'Hämtar...' : 'Hämta senaste 10'}
    </Button>
  );
};

export default QuickFetchButton;
