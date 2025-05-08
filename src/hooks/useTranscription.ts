import { useState } from 'react';
import { Transcript } from '../types';

export const useTranscription = () => {
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [progress, setProgress] = useState(0);

  const startTranscription = async (file: File, apiKey: string) => {
    try {
      setProgress(0);
      setTranscript([]);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call Netlify function
      const response = await fetch('/.netlify/functions/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      setTranscript(data.transcript);
      setProgress(100);

      return { transcript: data.transcript };
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  return {
    transcript,
    progress,
    startTranscription
  };
};