import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { Hook, Transcript } from '../../src/types';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get API key from Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    const apiKey = authHeader.split(' ')[1];
    const openai = new OpenAI({ apiKey });

    // Parse request body
    const { transcript, numHooks, model } = JSON.parse(event.body || '{}');
    
    if (!transcript || !Array.isArray(transcript)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid transcript format' })
      };
    }

    if (!numHooks || typeof numHooks !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Number of hooks is required' })
      };
    }

    // Prepare transcript text
    const transcriptText = transcript.map(t => t.text).join(' ');

    // Analyze transcript for hooks
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing video transcripts to find engaging hooks. 
          A hook is a moment that captures attention, creates emotional impact, or delivers value.
          Find ${numHooks} hooks in the transcript. For each hook, provide:
          1. Start and end times
          2. A description of why it's engaging
          3. The type of hook (emotional_spike, surprise, or value_bomb)
          4. A confidence score (0-1)`
        },
        {
          role: 'user',
          content: transcriptText
        }
      ],
      response_format: { type: 'json_object' }
    });

    // Parse and validate hooks
    const hooks: Hook[] = JSON.parse(response.choices[0].message.content).hooks.map((hook: any, index: number) => ({
      id: `hook-${index}`,
      startTime: hook.startTime,
      endTime: hook.endTime,
      description: hook.description,
      type: hook.type,
      confidence: hook.confidence
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ hooks })
    };
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 