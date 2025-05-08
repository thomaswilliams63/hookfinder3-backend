import { Handler } from '@netlify/functions';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

async function downloadAudioWithYtDlp(url: string): Promise<Buffer> {
  // Create a temp file path
  const tmpDir = os.tmpdir();
  const outputPath = path.join(tmpDir, `audio_${Date.now()}.mp3`);

  try {
    // Download audio using yt-dlp
    await execFileAsync('yt-dlp', [
      '-f', 'bestaudio',
      '--extract-audio',
      '--audio-format', 'mp3',
      '-o', outputPath,
      url
    ]);

    // Read the file into a buffer
    const audioBuffer = fs.readFileSync(outputPath);
    // Clean up temp file
    fs.unlinkSync(outputPath);
    return audioBuffer;
  } catch (error) {
    throw new Error('Failed to download audio with yt-dlp: ' + error);
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Download audio using yt-dlp
    const audioBuffer = await downloadAudioWithYtDlp(url);

    // TODO: Pass audioBuffer to your transcription logic (OpenAI Whisper, etc.)
    // For now, just return a success message
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, audioLength: audioBuffer.length })
    };
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 