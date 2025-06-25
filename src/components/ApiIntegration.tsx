
import React from 'react';
import QuickFetchButton from './QuickFetchButton';
import AdvancedSearchDialog from './AdvancedSearchDialog';
import ApiStatus from './ApiStatus';
import { Analysis } from '@/types';

interface ApiIntegrationProps {
  onAnalysisComplete: (analysis: Analysis) => void;
}

const ApiIntegration = ({ onAnalysisComplete }: ApiIntegrationProps) => {
  return (
    <div className="space-y-4">
      <QuickFetchButton onAnalysisComplete={onAnalysisComplete} />
      <AdvancedSearchDialog onAnalysisComplete={onAnalysisComplete} />
      <ApiStatus />
    </div>
  );
};

export default ApiIntegration;
