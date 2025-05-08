import { useState } from 'react';
import { Transcript } from '../types';

export const useTranscription = () => {
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [progress, setProgress] = useState(0);

  const startTranscription = async (file: File) => {
    try {
      setProgress(0);
      setTranscript([]);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call backend site for transcription
      const response = await fetch('https://hookfinder3-backend.netlify.app/.netlify/functions/transcribe', {
        method: 'POST',
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