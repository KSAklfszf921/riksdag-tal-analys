
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, TrendingUp, TrendingDown, Search, Filter, User, BarChart3 } from 'lucide-react';
import { Analysis } from '@/types';

interface TopListsProps {
  analyses: Analysis[];
}

const TopLists = ({ analyses }: TopListsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('all');
  const [searchWord, setSearchWord] = useState('');
  const [wordResults, setWordResults] = useState<{ analysis: Analysis; count: number }[]>([]);

  const getPartyColor = (party: string) => {
    const colors = {
      'S': 'bg-red-500',
      'M': 'bg-blue-500',
      'SD': 'bg-yellow-500',
      'C': 'bg-green-500',
      'V': 'bg-red-800',
      'KD': 'bg-blue-800',
      'L': 'bg-blue-400',
      'MP': 'bg-green-600'
    };
    return colors[party] || 'bg-gray-500';
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = !searchTerm || 
      analysis.speaker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = selectedParty === 'all' || analysis.party === selectedParty;
    return matchesSearch && matchesParty;
  });

  const topScorers = [...filteredAnalyses]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  const bottomScorers = [...filteredAnalyses]
    .sort((a, b) => a.totalScore - b.totalScore)
    .slice(0, 10);

  const partyAverages = analyses.reduce((acc, analysis) => {
    if (!analysis.party) return acc;
    if (!acc[analysis.party]) {
      acc[analysis.party] = { total: 0, count: 0, scores: [] };
    }
    acc[analysis.party].total += analysis.totalScore;
    acc[analysis.party].count += 1;
    acc[analysis.party].scores.push(analysis.totalScore);
    return acc;
  }, {});

  const partyStats = Object.entries(partyAverages).map(([party, data]: [string, { total: number; count: number; scores: number[] }]) => ({
    party,
    average: Math.round(data.total / data.count),
    count: data.count,
    highest: Math.max(...data.scores),
    lowest: Math.min(...data.scores)
  })).sort((a, b) => b.average - a.average);

  const uniqueParties = [...new Set(analyses.map(a => a.party).filter(Boolean))];

  const funStats = {
    longestSpeech: analyses.reduce((max, curr) =>
      (curr.wordCount || 0) > (max.wordCount || 0) ? curr : max,
      analyses[0] || {}
    ),
    shortestSpeech: analyses.reduce((min, curr) => 
      (curr.wordCount || 0) < (min.wordCount || 0) ? curr : min, 
      analyses[0] || {}
    ),
    mostComplex: analyses.reduce((max, curr) => 
      (curr.scores?.lix || 0) > (max.scores?.lix || 0) ? curr : max, 
      analyses[0] || {}
    ),
    mostVaried: analyses.reduce((max, curr) =>
      (curr.scores?.ovix || 0) > (max.scores?.ovix || 0) ? curr : max,
      analyses[0] || {}
    )
  };

  const handleWordSearch = () => {
    const word = searchWord.trim().toLowerCase();
    if (!word) {
      setWordResults([]);
      return;
    }
    const results = analyses
      .map(a => ({
        analysis: a,
        count: (a.content || '').toLowerCase().split(word).length - 1
      }))
      .filter(r => r.count > 0)
      .sort((a, b) => b.count - a.count);
    setWordResults(results);
  };

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Crown className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Inga analyser ännu. Analysera filer först för att se topplistor.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          🏆 Topplistor
        </h1>
        <p className="text-xl text-gray-600">
          Roliga och insiktsfulla rankningar av riksdagsanföranden
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Sök efter talare eller fil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedParty} onValueChange={setSelectedParty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrera parti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla partier</SelectItem>
                {uniqueParties.map(party => (
                  <SelectItem key={party} value={party}>{party}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="total" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="total">Totalpoäng</TabsTrigger>
          <TabsTrigger value="parties">Partier</TabsTrigger>
          <TabsTrigger value="fun">Roliga listor</TabsTrigger>
          <TabsTrigger value="search">Ordsökning</TabsTrigger>
        </TabsList>

        <TabsContent value="total" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Topp 10 - Högsta poäng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topScorers.map((analysis, index) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{analysis.speaker || 'Okänd'}</div>
                          <div className="text-sm text-gray-500">{analysis.fileName}</div>
                        </div>
                        {analysis.party && (
                          <Badge className={`${getPartyColor(analysis.party)} text-white`}>
                            {analysis.party}
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-lg font-bold">
                        {analysis.totalScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Botten 10 - Lägsta poäng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bottomScorers.map((analysis, index) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{analysis.speaker || 'Okänd'}</div>
                          <div className="text-sm text-gray-500">{analysis.fileName}</div>
                        </div>
                        {analysis.party && (
                          <Badge className={`${getPartyColor(analysis.party)} text-white`}>
                            {analysis.party}
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-lg font-bold">
                        {analysis.totalScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Genomsnittspoäng per parti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partyStats.map((party, index) => (
                  <Dialog key={party.party}>
                    <DialogTrigger asChild>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <Badge className={`${getPartyColor(party.party)} text-white text-lg px-4 py-2`}>
                            {party.party}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {party.count} anföranden
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{party.average}</div>
                          <div className="text-xs text-gray-500">
                            {party.lowest} - {party.highest}
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Resultat för {party.party}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {analyses.filter(a => a.party === party.party).map(a => (
                          <div key={a.id} className="flex justify-between border-b pb-1">
                            <span>{a.speaker || a.fileName}</span>
                            <Badge>{a.totalScore}</Badge>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fun" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📏 Längsta anförandet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {funStats.longestSpeech?.speaker || 'N/A'}
                  </div>
                  {funStats.longestSpeech?.party && (
                    <Badge className={`${getPartyColor(funStats.longestSpeech.party)} text-white`}>
                      {funStats.longestSpeech.party}
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600">
                    {funStats.longestSpeech?.wordCount || 0} ord
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Kortaste anförandet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {funStats.shortestSpeech?.speaker || 'N/A'}
                  </div>
                  {funStats.shortestSpeech?.party && (
                    <Badge className={`${getPartyColor(funStats.shortestSpeech.party)} text-white`}>
                      {funStats.shortestSpeech.party}
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600">
                    {funStats.shortestSpeech?.wordCount || 0} ord
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧠 Mest komplexa anförandet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-indigo-600">
                    {funStats.mostComplex?.speaker || 'N/A'}
                  </div>
                  {funStats.mostComplex?.party && (
                    <Badge className={`${getPartyColor(funStats.mostComplex.party)} text-white`}>
                      {funStats.mostComplex.party}
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600">
                    LIX: {funStats.mostComplex?.scores?.lix || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 Mest varierade vokabulär</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-teal-600">
                    {funStats.mostVaried?.speaker || 'N/A'}
                  </div>
                  {funStats.mostVaried?.party && (
                    <Badge className={`${getPartyColor(funStats.mostVaried.party)} text-white`}>
                      {funStats.mostVaried.party}
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600">
                    OVIX: {funStats.mostVaried?.scores?.ovix || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🔍 Sök efter ord i anföranden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Skriv ett ord för att söka..."
                  className="text-lg"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
                <Button className="w-full" onClick={handleWordSearch}>
                  Sök i alla anföranden
                </Button>
                {wordResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {wordResults.map((res) => (
                      <div key={res.analysis.id} className="flex justify-between p-2 border rounded">
                        <span>{res.analysis.speaker || res.analysis.fileName}</span>
                        <Badge className="bg-blue-100 text-blue-800">{res.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500 text-center">
                  Funktionen kommer att visa alla anföranden som innehåller sökordet,<br />
                  sorterat efter antal förekomster.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopLists;
