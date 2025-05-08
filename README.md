# HookFinder Backend

This is the backend service for HookFinder, handling video processing, transcription, and analysis using OpenAI.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Install youtube-dl (required for YouTube video processing):
   ```sh
   # macOS
   brew install youtube-dl

   # Ubuntu/Debian
   sudo apt-get install youtube-dl

   # Windows (using Chocolatey)
   choco install youtube-dl
   ```

## Development

Run the development server:
```sh
npm run dev
```

## Deployment

This backend is deployed on Netlify. The frontend is configured to use the following endpoints:

- `/.netlify/functions/process-youtube` - Process YouTube videos
- `/.netlify/functions/transcribe` - Transcribe local audio files
- `/.netlify/functions/analyze` - Analyze transcripts for hooks

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key 