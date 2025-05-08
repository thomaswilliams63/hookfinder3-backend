import { useState } from 'react';
import { Hook, Transcript } from '../types';

interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  hooks: Hook[];
  error: string | null;
}

export const useAnalysis = (model: string) => {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const startAnalysis = async (transcript: Transcript[], numHooks: number): Promise<Hook[]> => {
    // Call backend to analyze
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, numHooks, model })
    });
    if (!response.ok) throw new Error('Failed to analyze');
    const data = await response.json();
    setHooks(data.hooks);
    return data.hooks;
  };

  return { hooks, progress, startAnalysis };
};