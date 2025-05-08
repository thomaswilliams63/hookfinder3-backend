export interface Transcript {
  text: string;
  startTime: number;
  endTime: number;
}

export interface Hook {
  id: string;
  startTime: number;
  endTime: number;
  description: string;
  type: HookType;
  confidence: number;
}

export type HookType = 'emotional_spike' | 'surprise' | 'value_bomb';

export interface VideoInfo {
  title: string;
  duration: number;
  thumbnailUrl?: string;
  transcript: Transcript[];
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface ProcessingOptions {
  numHooks: number;
  minHookDuration: number;
  maxHookDuration: number;
}