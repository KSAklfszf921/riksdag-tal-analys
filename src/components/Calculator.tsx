
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator as CalcIcon, TrendingUp, Award, BarChart3 } from 'lucide-react';

interface ScoreRange {
  min: number;
  max: number;
  percentage: number;
  color: string;
}

const Calculator = () => {
  const scoringSystem = {
    weights: {
      high: 1.5,
      normal: 1.0,
      low: 0.5
    },
    maxRawScore: 105, // 7 high (10.5) + 8 normal (8) + 5 low (2.5) = 21 methods total
    distribution: {
      exceptional: { min: 90, max: 100, percentage: 1, color: 'bg-purple-100 text-purple-700' },
      veryHigh: { min: 80, max: 89, percentage: 4, color: 'bg-green-100 text-green-700' },
      high: { min: 60, max: 79, percentage: 30, color: 'bg-blue-100 text-blue-700' },
      medium: { min: 40, max: 59, percentage: 50, color: 'bg-yellow-100 text-yellow-700' },
      low: { min: 20, max: 39, percentage: 15, color: 'bg-orange-100 text-orange-700' },
      veryLow: { min: 0, max: 19, percentage: 0.1, color: 'bg-red-100 text-red-700' }
    } as Record<string, ScoreRange>
  };

  const methodWeights = [
    { name: 'LIX (Läsbarhet)', weight: 'Hög', multiplier: 1.5, maxScore: 50 },
    { name: 'OVIX (Ordvariation)', weight: 'Hög', multiplier: 1.5, maxScore: 50 },
    { name: 'Meningslängd', weight: 'Hög', multiplier: 1.5, maxScore: 50 },
    { name: 'Sparv-poäng', weight: 'Hög', multiplier: 1.5, maxScore: 50 },
    { name: 'Nominalkvot', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Ordlängd', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Bisatsfrekvens', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Konjunktioner', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Sentiment', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Abstraktion', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Textlängd', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Coherence Score', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Fluency Score', weight: 'Normal', multiplier: 1.0, maxScore: 50 },
    { name: 'Unika ord', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Passiv röst', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Modalitet', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Frågor', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Metaforer', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Styckestruktur', weight: 'Låg', multiplier: 0.5, maxScore: 50 },
    { name: 'Repetition', weight: 'Låg', multiplier: 0.5, maxScore: 50 }
  ];

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case 'Hög': return 'bg-red-100 text-red-700';
      case 'Normal': return 'bg-yellow-100 text-yellow-700';
      case 'Låg': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exampleCalculation = {
    lix: { score: 42, weight: 1.5, weighted: 63 },
    ovix: { score: 38, weight: 1.5, weighted: 57 },
    sentiment: { score: 35, weight: 1.0, weighted: 35 },
    rawTotal: 672, // Example sum of all weighted scores
    normalizedScore: 64 // Final score after normalization
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🧮 Beräkning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Så fungerar poängberäkningen och ratingsystemet för språkanalys
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalcIcon className="h-5 w-5 text-blue-600" />
                Beräkningsformeln
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">Steg 1: Viktad poäng per metod</h3>
                <code className="text-sm bg-white p-2 rounded block">
                  Viktad poäng = Råpoäng × Viktmultiplikator
                </code>
                <p className="text-sm text-blue-600 mt-2">
                  Varje metod ger 1-50 poäng, multiplicerat med viktfaktorn
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Steg 2: Summering</h3>
                <code className="text-sm bg-white p-2 rounded block">
                  Råtotal = Σ(Viktad poäng för alla metoder)
                </code>
                <p className="text-sm text-green-600 mt-2">
                  Max möjlig råpoäng: {scoringSystem.maxRawScore * 50} (alla metoder = 50 poäng)
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Steg 3: Normalisering</h3>
                <code className="text-sm bg-white p-2 rounded block">
                  Finalpoäng = (Råtotal / Max råtotal) × 100
                </code>
                <p className="text-sm text-purple-600 mt-2">
                  Resultatet skalas till 0-100 med logistisk justering för realistisk fördelning
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Viktfördelning per metod</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {methodWeights.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">Max: {method.maxScore} poäng</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getWeightColor(method.weight)}>
                        {method.weight}
                      </Badge>
                      <span className="font-mono text-sm">×{method.multiplier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Poängfördelning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(scoringSystem.distribution).map(([key, range]: [string, ScoreRange]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge className={range.color}>
                      {range.min}-{range.max} poäng
                    </Badge>
                    <span className="text-sm text-gray-600">{range.percentage}%</span>
                  </div>
                  <Progress value={range.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Exempelberäkning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>LIX: 42 × 1.5</span>
                  <span className="font-mono">{exampleCalculation.lix.weighted}</span>
                </div>
                <div className="flex justify-between">
                  <span>OVIX: 38 × 1.5</span>
                  <span className="font-mono">{exampleCalculation.ovix.weighted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sentiment: 35 × 1.0</span>
                  <span className="font-mono">{exampleCalculation.sentiment.weighted}</span>
                </div>
                <div className="text-center text-sm text-gray-500">+ 17 andra metoder...</div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Råtotal:</span>
                  <span className="font-mono">{exampleCalculation.rawTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Finalpoäng:</span>
                  <span className="font-mono text-blue-600">{exampleCalculation.normalizedScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Betygsskala
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { grade: 'A', range: '80-100', desc: 'Exceptionell kvalitet' },
                { grade: 'B', range: '70-79', desc: 'Mycket hög kvalitet' },
                { grade: 'C', range: '60-69', desc: 'Hög kvalitet' },
                { grade: 'D', range: '50-59', desc: 'Godkänd kvalitet' },
                { grade: 'E', range: '40-49', desc: 'Grundläggande nivå' },
                { grade: 'F', range: '0-39', desc: 'Under godkänd nivå' }
              ].map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-bold text-lg w-8 h-8 flex items-center justify-center">
                      {grade.grade}
                    </Badge>
                    <span className="font-medium">{grade.range} poäng</span>
                  </div>
                  <span className="text-sm text-gray-600">{grade.desc}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle>📊 Viktiga designprinciper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Realistisk fördelning</h3>
              <ul className="text-sm space-y-1 text-blue-600">
                <li>• 80+ poäng: Sällsynt (5% av anföranden)</li>
                <li>• 90+ poäng: Extremt sällsynt (1%)</li>
                <li>• Under 20 poäng: Nästan obefintligt</li>
                <li>• Majoritet: 40-70 poäng</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Viktningsstrategi</h3>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Hög vikt: Kärnmått för språkkvalitet</li>
                <li>• Normal vikt: Viktiga kompletterande faktorer</li>
                <li>• Låg vikt: Stilistiska nyanser</li>
                <li>• Balanserad helhetsbedömning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
