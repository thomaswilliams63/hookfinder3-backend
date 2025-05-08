import { useState } from 'react';
import { Transcript, VideoInfo } from '../types';
import { transcribeAudio } from '../services/openai';

interface TranscriptionState {
  isProcessing: boolean;
  progress: number;
  transcript: Transcript[];
  error: string | null;
}

interface TranscriptionResult {
  transcript: Transcript[];
}

export const useTranscription = () => {
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const startTranscription = async (file: File): Promise<{ transcript: Transcript[] }> => {
    // Call backend to transcribe
    const response = await fetch('/.netlify/functions/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file })
    });
    if (!response.ok) throw new Error('Failed to transcribe');
    const data = await response.json();
    setTranscript(data.transcript);
    return { transcript: data.transcript };
  };

  return { transcript, progress, startTranscription };
};