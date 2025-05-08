# HookFinder

A tool for finding engaging hooks in videos using AI.

## Project Structure

- `frontend/` - React frontend application
- `backend/` - Netlify serverless functions for video processing

## Setup

### Frontend

1. Install dependencies:
```bash
npm install
```

2. Development:
```bash
npm run dev
```

3. Build:
```bash
npm run build
```

### Backend

See the [backend README](./backend/README.md) for setup instructions.

## Features

- YouTube video processing
- Local video file upload
- AI-powered transcription
- Hook detection and analysis
- Modern, responsive UI

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (defaults to Netlify functions)

### Backend
- `OPENAI_API_KEY` - OpenAI API key for transcription

## Development

1. Start the frontend development server:
```bash
npm run dev
```

2. Start the backend development server:
```bash
cd backend
npm run dev
```

## Deployment

The application is deployed on Netlify:

1. Frontend: [hookfinder.netlify.app](https://hookfinder.netlify.app)
2. Backend: [hookfinder-api.netlify.app](https://hookfinder-api.netlify.app)

## License

MIT