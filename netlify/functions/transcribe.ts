import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { File } from 'formdata-node';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { file } = JSON.parse(event.body || '{}');
    if (!file) {
      return { statusCode: 400, body: 'File is required' };
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const audioFile = new File([buffer], 'audio.mp3', { type: 'audio/mp3' });

    // Transcribe audio using OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        transcript: transcription.text
      })
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}; 