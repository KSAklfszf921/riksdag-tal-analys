
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeText } from '@/utils/textAnalyzer';

interface FileUploadProps {
  onAnalysisComplete: (analysis: any) => void;
  setIsProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
}

const FileUpload = ({ onAnalysisComplete, setIsProcessing, setProgress }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const isTextFile = (file: File) =>
    file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(isTextFile);

      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
        toast({
          title: "Filer tillagda",
          description: `${droppedFiles.length} fil(er) redo för analys`,
        });
      } else {
        toast({
          title: "Ogiltigt filformat",
          description: "Endast .txt-filer accepteras",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(isTextFile);
    if (selectedFiles.length === 0) {
      toast({
        title: "Ogiltigt filformat",
        description: "Endast .txt-filer accepteras",
        variant: "destructive",
      });
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const text = await file.text();

          setProgress(((i + 0.5) / files.length) * 100);

          const analysis = await analyzeText(text, file.name, (methodProgress) => {
            const totalProgress = ((i + methodProgress / 100) / files.length) * 100;
            setProgress(totalProgress);
          });

          onAnalysisComplete(analysis);

          setProgress(((i + 1) / files.length) * 100);
        } catch (fileError) {
          console.error('File processing error:', fileError);
          toast({
            title: 'Fel vid fil',
            description: `${file.name} kunde inte analyseras`,
            variant: 'destructive',
          });
        }
      }

      setFiles([]);
      toast({
        title: "Analys slutförd",
        description: `${files.length} fil(er) har analyserats`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Fel vid analys",
        description: "Ett fel uppstod under analysen",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Dra och släpp dina anförandefiler här
        </p>
        <p className="text-sm text-gray-500 mb-4">
          eller klicka för att välja filer (.txt format)
        </p>
        <input
          type="file"
          multiple
          accept=".txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" className="cursor-pointer">
            Välj filer
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-medium">Valda filer ({files.length})</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              onClick={analyzeFiles}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Analysera {files.length} fil(er)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
