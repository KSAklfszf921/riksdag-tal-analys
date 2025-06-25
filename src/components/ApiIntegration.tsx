
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiIntegrationProps {
  onAnalysisComplete: (analysis: any) => void;
}

const ApiIntegration = ({ onAnalysisComplete }: ApiIntegrationProps) => {
  const [searchParams, setSearchParams] = useState({
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

  const speechTypes = [
    { value: 'anforande', label: 'Anföranden' },
    { value: 'interpellation', label: 'Interpellationer' },
    { value: 'fraga', label: 'Frågor' },
    { value: 'motion', label: 'Motioner' }
  ];

  const handleQuickFetch = async () => {
    setIsLoading(true);
    toast({
      title: "Hämtar anföranden",
      description: "Hämtar de senaste 10 anförandena från Riksdagen...",
    });

    // Simulate API call - replace with actual Riksdag API integration
    setTimeout(() => {
      const mockSpeeches = [
        {
          id: 'api-1',
          speaker: 'Ulf Kristersson',
          party: 'M',
          title: 'Regeringsförklaring',
          date: '2024-01-15',
          content: 'Herr talman! Sverige står inför stora utmaningar...'
        },
        {
          id: 'api-2',
          speaker: 'Magdalena Andersson',
          party: 'S',
          title: 'Ekonomisk politik',
          date: '2024-01-14',
          content: 'Herr talman! Den ekonomiska politiken måste...'
        }
      ];

      mockSpeeches.forEach(speech => {
        const mockAnalysis = {
          id: speech.id,
          fileName: `${speech.speaker}_${speech.date}.txt`,
          speaker: speech.speaker,
          party: speech.party,
          date: new Date(speech.date),
          totalScore: Math.floor(Math.random() * 40) + 40, // 40-80 range
          scores: {
            lix: Math.floor(Math.random() * 20) + 30,
            ovix: Math.floor(Math.random() * 30) + 40,
            nk: Math.floor(Math.random() * 15) + 10
          },
          source: 'riksdag-api'
        };
        onAnalysisComplete(mockAnalysis);
      });

      setIsLoading(false);
      toast({
        title: "Hämtning slutförd",
        description: `${mockSpeeches.length} anföranden har hämtats och analyserats`,
      });
    }, 2000);
  };

  const handleAdvancedSearch = async () => {
    setIsLoading(true);
    // Implement advanced search with parameters
    toast({
      title: "Sökning pågår",
      description: "Söker anföranden enligt dina kriterier...",
    });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Sökning slutförd",
        description: "Inga anföranden hittades för de valda kriterierna",
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleQuickFetch}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Download className="h-4 w-4 mr-2" />
        {isLoading ? 'Hämtar...' : 'Hämta senaste 10'}
      </Button>

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
              <Label>Anförandetyp</Label>
              <Select 
                value={searchParams.type} 
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alla typer" />
                </SelectTrigger>
                <SelectContent>
                  {speechTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAdvancedSearch}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Söker...' : 'Sök och analysera'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-xs text-gray-500 text-center">
        <Badge variant="outline" className="mr-2">
          <Calendar className="h-3 w-3 mr-1" />
          Riksmöte 2023/24
        </Badge>
        <Badge variant="outline">
          <Users className="h-3 w-3 mr-1" />
          349 ledamöter
        </Badge>
      </div>
    </div>
  );
};

export default ApiIntegration;
