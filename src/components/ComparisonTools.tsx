import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Analysis } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComparisonToolsProps {
  analyses: Analysis[];
}

const ComparisonTools = ({ analyses }: ComparisonToolsProps) => {
  const speakers = Array.from(new Set(analyses.map(a => a.speaker).filter(Boolean)));
  const parties = Array.from(new Set(analyses.map(a => a.party).filter(Boolean)));

  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);

  const toggleSpeaker = (name: string) => {
    setSelectedSpeakers(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const toggleParty = (p: string) => {
    setSelectedParties(prev =>
      prev.includes(p) ? prev.filter(sp => sp !== p) : [...prev, p]
    );
  };

  const speakerData = selectedSpeakers.map(s => {
    const speakerAnalyses = analyses.filter(a => a.speaker === s);
    const avg =
      speakerAnalyses.reduce((sum, a) => sum + a.totalScore, 0) /
      (speakerAnalyses.length || 1);
    return { name: s, average: Math.round(avg) };
  });

  const partyData = selectedParties.map(p => {
    const partyAnalyses = analyses.filter(a => a.party === p);
    const avg =
      partyAnalyses.reduce((sum, a) => sum + a.totalScore, 0) /
      (partyAnalyses.length || 1);
    return { name: p, average: Math.round(avg) };
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Jämförelser</h1>
        <p className="text-gray-600">Välj ledamöter eller partier för att jämföra deras genomsnittliga poäng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ledamöter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {speakers.map(s => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedSpeakers.includes(s)}
                  onCheckedChange={() => toggleSpeaker(s)}
                />
                {s}
              </label>
            ))}
          </div>
          {speakerData.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speakerData} margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#4f46e5" name="Snittpoäng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {parties.map(p => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedParties.includes(p)}
                  onCheckedChange={() => toggleParty(p)}
                />
                {p}
              </label>
            ))}
          </div>
          {partyData.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partyData} margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#16a34a" name="Snittpoäng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonTools;
