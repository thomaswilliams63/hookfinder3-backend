import { Hook, HookType, Transcript } from '../types';

const DEFAULT_API_MODEL = 'gpt-4';

export async function transcribeAudio(
  audioBlob: Blob,
  apiKey: string
): Promise<Transcript[]> {
  try {
    // Create form data with audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Process the response to create timestamps
    const words = data.words || [];
    
    // Group words into sentences or appropriate segments
    const segments: Transcript[] = [];
    let currentSegment: Transcript = { text: '', startTime: 0, endTime: 0 };
    let segmentWords: string[] = [];
    
    words.forEach((word: any, index: number) => {
      segmentWords.push(word.word);
      
      if (index === 0) {
        currentSegment.startTime = word.start;
      }
      
      // End the segment at punctuation or every 15 words
      if (
        word.word.match(/[.!?]$/) || 
        segmentWords.length >= 15 ||
        index === words.length - 1
      ) {
        currentSegment.text = segmentWords.join(' ').trim();
        currentSegment.endTime = word.end;
        segments.push(currentSegment);
        
        // Reset for next segment
        currentSegment = { text: '', startTime: word.end, endTime: 0 };
        segmentWords = [];
      }
    });
    
    return segments;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function analyzeTranscript(
  transcript: Transcript[],
  numHooks: number,
  apiKey: string,
  model: string = DEFAULT_API_MODEL
): Promise<Hook[]> {
  try {
    // Join transcript segments into full text with timestamps
    const fullTranscript = transcript.map(segment => 
      `[${formatTime(segment.startTime)}-${formatTime(segment.endTime)}]: ${segment.text}`
    ).join('\n');
    
    const prompt = `
      Analyze the following video transcript and identify the ${numHooks} most engaging moments that would make great hooks.
      Look for:
      1. Emotional spikes - moments of excitement, passion, or strong emotion
      2. Surprises - unexpected information, twists, or counterintuitive points
      3. Value bombs - key insights, actionable advice, or important takeaways
      
      For each hook, provide:
      1. The exact timestamp range (start-end)
      2. A brief, compelling description (15 words max)
      3. The type of hook (emotional_spike, surprise, or value_bomb)
      4. A confidence score (0-100) of how engaging this moment is
      
      Format your response as a JSON array with objects containing: startTime, endTime, description, type, and confidence.
      
      Transcript:
      ${fullTranscript}
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert video editor who specializes in identifying the most engaging and hook-worthy moments in video content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    // Convert the parsed results to our Hook type
    return (result.hooks || []).map((hook: any, index: number) => ({
      id: `hook-${index}`,
      startTime: parseTimeToSeconds(hook.startTime),
      endTime: parseTimeToSeconds(hook.endTime),
      description: hook.description,
      type: hook.type as HookType,
      confidence: hook.confidence
    }));
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

// Helper function to format seconds to MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to parse MM:SS format to seconds
function parseTimeToSeconds(timeStr: string): number {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds;
}