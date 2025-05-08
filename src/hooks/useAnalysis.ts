import { useState } from 'react';
import { Hook, Transcript } from '../types';
import { analyzeTranscript } from '../services/openai';

interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  hooks: Hook[];
  error: string | null;
}

export function useAnalysis(apiKey: string, model: string) {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    hooks: [],
    error: null
  });

  const startAnalysis = async (transcript: Transcript[], numHooks: number): Promise<Hook[]> => {
    try {
      setState({
        isAnalyzing: true,
        progress: 0,
        hooks: [],
        error: null
      });
      
      // Update progress for UI feedback
      setState(prev => ({ ...prev, progress: 20 }));
      
      // Send to OpenAI for analysis
      const hooks = await analyzeTranscript(transcript, numHooks, apiKey, model);
      
      // Sort hooks by confidence
      const sortedHooks = [...hooks].sort((a, b) => b.confidence - a.confidence);
      
      // Update progress
      setState(prev => ({ 
        ...prev, 
        progress: 100,
        isAnalyzing: false,
        hooks: sortedHooks
      }));
      
      return sortedHooks;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'Unknown error during analysis'
      }));
      throw error;
    }
  };

  return {
    ...state,
    startAnalysis
  };
}