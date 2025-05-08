import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { File } from 'formdata-node';

const execAsync = promisify(exec);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    if (!url) {
      return { statusCode: 400, body: 'URL is required' };
    }

    // Create a temporary directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'youtube-'));
    const outputPath = path.join(tempDir, 'output.mp3');

    // Download video and extract audio using youtube-dl
    await execAsync(`youtube-dl -x --audio-format mp3 -o "${outputPath}" "${url}"`);

    // Read the audio file
    const audioBuffer = fs.readFileSync(outputPath);

    // Convert buffer to File object
    const audioFile = new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' });

    // Transcribe audio using OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1'
    });

    // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Return video info with transcript
    return {
      statusCode: 200,
      body: JSON.stringify({
        title: 'YouTube Video',
        duration: 600, // 10 minutes in seconds
        transcript: transcription.text
      })
    };
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}; 