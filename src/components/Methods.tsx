
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, Zap, BarChart3 } from 'lucide-react';

const Methods = () => {
  const methodCategories = [
    {
      id: 'lexical',
      title: 'Lexikala metoder',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-700',
      methods: [
        {
          name: 'LIX (Läsbarhetsindex)',
          description: 'Mäter textens läsbarhet baserat på meningslängd och andel långa ord',
          scale: '0-80',
          interpretation: 'Lägre värde = lättare att läsa',
          weight: 'Hög',
          example: 'LIX under 30 = lätt text, över 60 = svår text'
        },
        {
          name: 'OVIX (Ordvariationsindex)',
          description: 'Mäter ordrikedomen och variationen i ordförrådet',
          scale: '0-100',
          interpretation: 'Högre värde = mer varierat ordförråd',
          weight: 'Hög',
          example: 'OVIX över 70 = rikt ordförråd'
        },
        {
          name: 'Nominalkvot (NK)',
          description: 'Förhållandet mellan substantiv och verb - indikerar formalitet',
          scale: '0-30',
          interpretation: 'Högre värde = mer formell stil',
          weight: 'Normal',
          example: 'NK över 20 = mycket formell text'
        },
        {
          name: 'Ordlängd',
          description: 'Genomsnittlig längd på ord i texten',
          scale: '3-8 bokstäver',
          interpretation: 'Längre ord = mer komplex text',
          weight: 'Normal',
          example: 'Genomsnitt över 6 bokstäver = avancerat språk'
        },
        {
          name: 'Unika ord',
          description: 'Andel unika ord av totala antalet ord',
          scale: '20-80%',
          interpretation: 'Högre andel = mer varierat språk',
          weight: 'Låg',
          example: 'Över 60% = mycket varierat ordförråd'
        }
      ]
    },
    {
      id: 'syntactic',
      title: 'Syntaktiska metoder',
      icon: Target,
      color: 'bg-green-100 text-green-700',
      methods: [
        {
          name: 'Meningslängd',
          description: 'Genomsnittligt antal ord per mening',
          scale: '5-30 ord',
          interpretation: 'Längre meningar = mer komplex syntax',
          weight: 'Hög',
          example: 'Över 20 ord/mening = komplex struktur'
        },
        {
          name: 'Bisatsfrekvens',
          description: 'Andel bisatser av totala antalet satser',
          scale: '10-60%',
          interpretation: 'Fler bisatser = mer komplex grammatik',
          weight: 'Normal',
          example: 'Över 40% = avancerad syntax'
        },
        {
          name: 'Passiv röst',
          description: 'Andel passiva konstruktioner',
          scale: '5-40%',
          interpretation: 'Mer passiv = formell stil',
          weight: 'Låg',
          example: 'Över 25% = mycket formell text'
        },
        {
          name: 'Konjunktioner',
          description: 'Frekvens av sambandsord per 100 ord',
          scale: '2-8 per 100 ord',
          interpretation: 'Fler konjunktioner = bättre textbindning',
          weight: 'Normal',
          example: 'Över 6 per 100 = välstrukturerad text'
        }
      ]
    },
    {
      id: 'semantic',
      title: 'Semantiska metoder',
      icon: Brain,
      color: 'bg-purple-100 text-purple-700',
      methods: [
        {
          name: 'Sentiment',
          description: 'Textens känslomässiga ton',
          scale: '-1 till +1',
          interpretation: 'Negativ till positiv känsloton',
          weight: 'Normal',
          example: 'Över 0.3 = positiv ton, under -0.3 = negativ'
        },
        {
          name: 'Abstraktion',
          description: 'Andel abstrakta vs konkreta begrepp',
          scale: '20-80%',
          interpretation: 'Högre andel = mer abstrakt språk',
          weight: 'Normal',
          example: 'Över 60% = mycket abstrakt diskussion'
        },
        {
          name: 'Modalitet',
          description: 'Frekvens av modalverb och uttryck för osäkerhet',
          scale: '1-10%',
          interpretation: 'Högre andel = mer nyanserat språk',
          weight: 'Låg',
          example: 'Över 5% = många nyanseringar'
        },
        {
          name: 'Frågor',
          description: 'Antal frågor per 100 meningar',
          scale: '0-20',
          interpretation: 'Fler frågor = mer retorisk stil',
          weight: 'Låg',
          example: 'Över 10 = mycket retoriskt'
        },
        {
          name: 'Metaforer',
          description: 'Frekvens av bildspråk och metaforer',
          scale: '0-5%',
          interpretation: 'Högre andel = mer expressivt språk',
          weight: 'Låg',
          example: 'Över 2% = bildrik framställning'
        }
      ]
    },
    {
      id: 'textual',
      title: 'Textbaserade metoder',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-700',
      methods: [
        {
          name: 'Textlängd',
          description: 'Totalt antal ord i texten',
          scale: '100-5000 ord',
          interpretation: 'Längre texter möjliggör mer utvecklade resonemang',
          weight: 'Normal',
          example: 'Över 2000 ord = omfattande anförande'
        },
        {
          name: 'Styckestruktur',
          description: 'Genomsnittlig styckelängd och variation',
          scale: '3-15 meningar/stycke',
          interpretation: 'Balanserad struktur = bättre organisation',
          weight: 'Låg',
          example: '5-8 meningar/stycke = optimal struktur'
        },
        {
          name: 'Repetition',
          description: 'Andel upprepade fraser och uttryck',
          scale: '5-25%',
          interpretation: 'Måttlig repetition = retorisk styrka',
          weight: 'Låg',
          example: '10-15% = effektiv retorisk repetition'
        }
      ]
    },
    {
      id: 'automated',
      title: 'Automatiserade metoder',
      icon: Zap,
      color: 'bg-red-100 text-red-700',
      methods: [
        {
          name: 'Sparv-poäng',
          description: 'Sammansatt poäng från Språkbankens Sparv-system',
          scale: '0-100',
          interpretation: 'Automatisk bedömning av språklig kvalitet',
          weight: 'Hög',
          example: 'Över 75 = hög språklig kvalitet enligt Sparv'
        },
        {
          name: 'Coherence Score',
          description: 'Automatisk mätning av textens sammanhang',
          scale: '0-1',
          interpretation: 'Högre värde = bättre sammanhang',
          weight: 'Normal',
          example: 'Över 0.7 = god textsammanhållning'
        },
        {
          name: 'Fluency Score',
          description: 'Bedömning av språkflyt och naturlighet',
          scale: '0-1',
          interpretation: 'Högre värde = mer naturligt språk',
          weight: 'Normal',
          example: 'Över 0.8 = mycket naturligt språkflyt'
        }
      ]
    }
  ];

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case 'Hög': return 'bg-red-100 text-red-700';
      case 'Normal': return 'bg-yellow-100 text-yellow-700';
      case 'Låg': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 Mätmetoder
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Detaljerad beskrivning av alla 20 mätmetoder som används för att bedöma språklig kvalitet i riksdagsanföranden
        </p>
      </div>

      <Tabs defaultValue="lexical" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {methodCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {methodCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card className={category.color}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <category.icon className="h-6 w-6" />
                  {category.title}
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              {category.methods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <Badge className={getWeightColor(method.weight)}>
                        Vikt: {method.weight}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{method.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-700 mb-1">Skala</h4>
                        <p className="text-sm text-blue-600">{method.scale}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-green-700 mb-1">Tolkning</h4>
                        <p className="text-sm text-green-600">{method.interpretation}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-700 mb-1">Exempel</h4>
                        <p className="text-sm text-purple-600">{method.example}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Exempel på repetition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-red-600 mb-1">Repetitiv text</h4>
            <p className="text-sm text-gray-700">
              "Herr talman! Vi kräver förändring, vi kräver ansvar, vi kräver handling. Vi kräver att regeringen agerar nu!"
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-1">Icke repetitiv text</h4>
            <p className="text-sm text-gray-700">
              "Herr talman! Regeringen måste ta ansvar för landets ekonomi genom att genomföra nödvändiga reformer."
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle>ℹ️ Viktinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700">Hög vikt (1.5x)</Badge>
              <span className="text-sm">Mest avgörande för totalpoäng</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-700">Normal vikt (1.0x)</Badge>
              <span className="text-sm">Standard påverkan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">Låg vikt (0.5x)</Badge>
              <span className="text-sm">Kompletterande faktorer</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Alla metoder kombineras för att skapa en totalpoäng mellan 0-100, där varje metod bidrar enligt sin viktning.
            Sällsynt med poäng över 80, extremt sällsynt över 90. Poäng under 20 är också mycket ovanliga.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Methods;
