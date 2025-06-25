
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchSpeeches, ApiSearchParams } from '@/utils/riksdagApi';
import { analyzeText } from '@/utils/textAnalyzer';
import { Analysis } from '@/types';

interface AdvancedSearchDialogProps {
  onAnalysisComplete: (analysis: Analysis) => void;
}

const AdvancedSearchDialog = ({ onAnalysisComplete }: AdvancedSearchDialogProps) => {
  const [searchParams, setSearchParams] = useState<ApiSearchParams>({
    year: '',
    party: '',
    member: '',
    type: '',
    limit: '10'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parties = [
    { value: 'S', label: 'Socialdemokraterna (S)' },
    { value: 'M', label: 'Moderaterna (M)' },
    { value: 'SD', label: 'Sverigedemokraterna (SD)' },
    { value: 'C', label: 'Centerpartiet (C)' },
    { value: 'V', label: 'Vänsterpartiet (V)' },
    { value: 'KD', label: 'Kristdemokraterna (KD)' },
    { value: 'L', label: 'Liberalerna (L)' },
    { value: 'MP', label: 'Miljöpartiet (MP)' }
  ];

  const handleAdvancedSearch = async () => {
    setIsLoading(true);
    toast({
      title: "Sökning pågår",
      description: "Söker anföranden enligt dina kriterier...",
    });

    try {
      const speeches = await searchSpeeches(searchParams);
      
      if (speeches.length === 0) {
        toast({
          title: "Sökning slutförd",
          description: "Inga anföranden hittades för de valda kriterierna",
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
        title: "Sökning slutförd",
        description: `${speeches.length} anföranden har hämtats och analyserats`,
      });
    } catch (error) {
      console.error('API search error:', error);
      toast({
        title: "Fel vid sökning",
        description: error instanceof Error ? error.message : "Ett okänt fel uppstod",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Avancerad sökning
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sök i Riksdagens databas</DialogTitle>
          <DialogDescription>
            Anpassa dina sökkriterier för att hitta specifika anföranden
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Riksmöte/År</Label>
              <Input
                id="year"
                placeholder="2023/24"
                value={searchParams.year}
                onChange={(e) => setSearchParams(prev => ({ ...prev, year: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="limit">Antal resultat</Label>
              <Select 
                value={searchParams.limit} 
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, limit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Parti</Label>
            <Select 
              value={searchParams.party} 
              onValueChange={(value) => setSearchParams(prev => ({ ...prev, party: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj parti" />
              </SelectTrigger>
              <SelectContent>
                {parties.map(party => (
                  <SelectItem key={party.value} value={party.value}>
                    {party.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="member">Ledamot</Label>
            <Input
              id="member"
              placeholder="Förnamn Efternamn"
              value={searchParams.member}
              onChange={(e) => setSearchParams(prev => ({ ...prev, member: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="searchTerm">Sökord</Label>
            <Input
              id="searchTerm"
              placeholder="klimat, ekonomi, etc."
              value={searchParams.searchTerm}
              onChange={(e) => setSearchParams(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          <Button
            onClick={handleAdvancedSearch}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Söker...' : 'Sök och analysera'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
