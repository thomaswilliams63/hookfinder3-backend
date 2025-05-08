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

export function useTranscription(apiKey: string) {
  const [state, setState] = useState<TranscriptionState>({
    isProcessing: false,
    progress: 0,
    transcript: [],
    error: null
  });

  const startTranscription = async (audioFile: File): Promise<TranscriptionResult> => {
    try {
      setState({
        isProcessing: true,
        progress: 0,
        transcript: [],
        error: null
      });
      
      // Update progress for UI feedback
      setState(prev => ({ ...prev, progress: 10 }));
      
      // Convert to audio blob if needed
      const audioBlobForTranscription = audioFile;
      
      // Update progress
      setState(prev => ({ ...prev, progress: 30 }));
      
      // Send to OpenAI for transcription
      const transcript = await transcribeAudio(audioBlobForTranscription, apiKey);
      
      // Update progress
      setState(prev => ({ 
        ...prev, 
        progress: 100,
        isProcessing: false,
        transcript
      }));
      
      return { transcript };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Unknown error during transcription'
      }));
      throw error;
    }
  };

  return {
    ...state,
    startTranscription
  };
}