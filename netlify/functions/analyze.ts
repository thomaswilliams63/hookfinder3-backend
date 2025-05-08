import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { transcript, numHooks, model } = JSON.parse(event.body || '{}');
    if (!transcript) {
      return { statusCode: 400, body: 'Transcript is required' };
    }

    // Analyze transcript using OpenAI
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Analyze the following transcript and identify ${numHooks} potential hooks. A hook is a moment that captures attention or creates emotional impact. For each hook, provide:
          1. Start time (in seconds)
          2. End time (in seconds)
          3. Description of why it's a hook
          4. Type of hook (emotional_spike, surprise, or value_bomb)
          5. Confidence score (0-1)`
        },
        {
          role: 'user',
          content: transcript
        }
      ]
    });

    // Parse the response into hooks
    const hooks = parseHooksFromResponse(completion.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify({ hooks })
    };
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

function parseHooksFromResponse(response: string) {
  // This is a simplified parser - you might want to make it more robust
  const hooks = [];
  const lines = response.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Hook')) {
      const hook = {
        id: `hook-${hooks.length + 1}`,
        startTime: parseFloat(lines[i + 1].split(':')[1].trim()),
        endTime: parseFloat(lines[i + 2].split(':')[1].trim()),
        description: lines[i + 3].split(':')[1].trim(),
        type: lines[i + 4].split(':')[1].trim(),
        confidence: parseFloat(lines[i + 5].split(':')[1].trim())
      };
      hooks.push(hook);
    }
  }
  
  return hooks;
} 