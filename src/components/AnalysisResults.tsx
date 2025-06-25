
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

  const averageTotal = Math.round(
    analyses.reduce((sum, a) => sum + a.totalScore, 0) / (analyses.length || 1)
  );
  const averageLix = Math.round(
    analyses.reduce((sum, a) => sum + (a.scores?.lix || 0), 0) / (analyses.length || 1)
  );
  const averageOvix = Math.round(
    analyses.reduce((sum, a) => sum + (a.scores?.ovix || 0), 0) / (analyses.length || 1)
  );
  const averageNk = Math.round(
    analyses.reduce((sum, a) => sum + (a.scores?.nk || 0), 0) / (analyses.length || 1)
  );

import { Analysis } from '@/types';

interface AnalysisResultsProps {
  analyses: Analysis[];
}

const AnalysisResults = ({ analyses }: AnalysisResultsProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

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

  const exportData = (format: string) => {
    if (format === 'csv') {
      const csvContent = analyses.map(a => 
        `${a.fileName},${a.speaker || 'N/A'},${a.party || 'N/A'},${a.totalScore},${a.date.toISOString()}`
      ).join('\n');
      
      const blob = new Blob([`Fil,Talare,Parti,Totalpoäng,Datum\n${csvContent}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'riksdag-analyser.csv';
      a.click();
    }
  };

  const paginatedAnalyses = analyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(analyses.length / itemsPerPage);

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Inga analyser än. Ladda upp filer eller hämta från Riksdagens API för att komma igång.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analyser</h2>
          <p className="text-gray-600">Senaste analyser av riksdagsanföranden ({analyses.length} totalt)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportData('json')}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fil</TableHead>
                <TableHead>Talare</TableHead>
                <TableHead>Parti</TableHead>
                <TableHead>Totalpoäng</TableHead>
                <TableHead>Betyg</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnalyses.map((analysis, index) => (
                <TableRow key={analysis.id || index}>
                  <TableCell className="font-medium">{analysis.fileName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {analysis.speaker || 'Okänd'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {analysis.party && (
                      <Badge className={`${getPartyColor(analysis.party)} text-white`}>
                        {analysis.party}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(analysis.totalScore)}>
                        {analysis.totalScore}
                      </Badge>
                      <Progress value={analysis.totalScore} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getScoreColor(analysis.totalScore)}>
                      {getScoreGrade(analysis.totalScore)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {analysis.date.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOverviewAnalysis(analysis)}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Överblick - {analysis.fileName}</DialogTitle>
                            <DialogDescription>Hela anförandet</DialogDescription>
                          </DialogHeader>
                          {overviewAnalysis?.content && (
                            <pre className="whitespace-pre-wrap text-sm">
                              {overviewAnalysis.content}
                            </pre>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAnalysis(analysis)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detaljerad analys - {analysis.fileName}</DialogTitle>
                            <DialogDescription>
                              Fullständig språkanalys med alla mätmetoder
                            </DialogDescription>
                          </DialogHeader>
                        {selectedAnalysis && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 border rounded">
                                <div className="text-2xl font-bold text-blue-600">{selectedAnalysis.totalScore}</div>
                                <div className="text-sm text-gray-500">Totalpoäng</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <div className="text-2xl font-bold text-green-600">{getScoreGrade(selectedAnalysis.totalScore)}</div>
                                <div className="text-sm text-gray-500">Betyg</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <div className="text-lg font-bold">{selectedAnalysis.speaker || 'Okänd'}</div>
                                <div className="text-sm text-gray-500">Talare</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <Badge className={`${getPartyColor(selectedAnalysis.party)} text-white`}>
                                  {selectedAnalysis.party || 'N/A'}
                                </Badge>
                                <div className="text-sm text-gray-500 mt-1">Parti</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 border rounded">
                                <div className="text-lg font-semibold">{averageTotal}</div>
                                <div className="text-sm text-gray-500">Snitt totalpoäng</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <div className="text-lg font-semibold">{averageLix}</div>
                                <div className="text-sm text-gray-500">Snitt LIX</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <div className="text-lg font-semibold">{averageOvix}</div>
                                <div className="text-sm text-gray-500">Snitt OVIX</div>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <div className="text-lg font-semibold">{averageNk}</div>
                                <div className="text-sm text-gray-500">Snitt NK</div>
                              </div>
                            </div>

                            {selectedAnalysis.scores && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm">LIX (Läsbarhet)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{selectedAnalysis.scores.lix}</div>
                                  <Progress value={(selectedAnalysis.scores.lix / 80) * 100} className="mt-2" />
                                  <div className="text-sm mt-2">Betyg {getScoreGrade(selectedAnalysis.scores.lix)}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm">OVIX (Ordvariation)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{selectedAnalysis.scores.ovix}</div>
                                  <Progress value={selectedAnalysis.scores.ovix} className="mt-2" />
                                  <div className="text-sm mt-2">Betyg {getScoreGrade(selectedAnalysis.scores.ovix)}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm">NK (Nominalkvot)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{selectedAnalysis.scores.nk}</div>
                                  <Progress value={(selectedAnalysis.scores.nk / 30) * 100} className="mt-2" />
                                  <div className="text-sm mt-2">Betyg {getScoreGrade(selectedAnalysis.scores.nk)}</div>
                                </CardContent>
                              </Card>
                              </div>
                            )}
                          </div>
                        )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Föregående
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Sida {currentPage} av {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Nästa
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
