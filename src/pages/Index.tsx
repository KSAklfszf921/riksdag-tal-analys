import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, FileText, BarChart3, Search, Crown, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import TopLists from '@/components/TopLists';
import Methods from '@/components/Methods';
import Calculator from '@/components/Calculator';
import ApiIntegration from '@/components/ApiIntegration';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [analyses, setAnalyses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const STORAGE_KEY = 'riksdag-analyses-v1';
  const LEGACY_KEY = 'riksdag-analyses';

  // Load saved analyses on component mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const analysesWithDates = parsed.map((analysis: any) => ({
        ...analysis,
        date: new Date(analysis.date),
      }));
      setAnalyses(analysesWithDates);
      // Migrate legacy key if needed
      if (localStorage.getItem(LEGACY_KEY)) {
        localStorage.removeItem(LEGACY_KEY);
        localStorage.setItem(STORAGE_KEY, stored);
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save analyses to localStorage whenever analyses change
  useEffect(() => {
    if (analyses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [analyses]);

  const handleAnalysisComplete = (newAnalysis) => {
    setAnalyses(prev => [newAnalysis, ...prev]);
    toast({
      title: "Analys slutförd",
      description: `${newAnalysis.speaker} (${newAnalysis.party}) har analyserats`,
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-xl">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Riksdagsspråk.se
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Avancerad språkanalys av svenska riksdagsanföranden med AI-driven insikter
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  20+ Analysmetoder
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Realtidsanalys
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Topplistor
                </Badge>
              </div>
            </div>

            {/* Quick Upload Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Snabbuppladdning
                  </CardTitle>
                  <CardDescription>
                    Dra och släpp dina anförandefiler här för omedelbar analys
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload 
                    onAnalysisComplete={handleAnalysisComplete}
                    setIsProcessing={setIsProcessing}
                    setProgress={setProgress}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Riksdagens API
                  </CardTitle>
                  <CardDescription>
                    Hämta anföranden direkt från Riksdagens databas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApiIntegration onAnalysisComplete={handleAnalysisComplete} />
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyserar...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Analyses */}
            <AnalysisResults analyses={analyses.slice(0, 10)} />
          </div>
        );
      case 'toplists':
        return <TopLists analyses={analyses} />;
      case 'methods':
        return <Methods />;
      case 'calculator':
        return <Calculator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="outline" className="text-xs">
          Tryck F1 för hjälp
        </Badge>
      </div>
    </div>
  );
};

export default Index;
