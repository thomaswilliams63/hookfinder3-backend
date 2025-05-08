import { useState } from 'react';
import { Hook, Transcript } from '../types';

export const useAnalysis = (model: string) => {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [progress, setProgress] = useState(0);

  const startAnalysis = async (transcript: Transcript[], numHooks: number, apiKey: string) => {
    try {
      setProgress(0);
      setHooks([]);

      // Call Netlify function
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          transcript,
          numHooks,
          model
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze transcript');
      }

      const data = await response.json();
      setHooks(data.hooks);
      setProgress(100);

      return data.hooks;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  return {
    hooks,
    progress,
    startAnalysis
  };
};