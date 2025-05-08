# hookfinder3

## Project Overview
This project processes video files and YouTube videos to extract transcripts and analyze hooks using OpenAI.

## Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/hookfinder3.git
   cd hookfinder3
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```

## Deployment
### GitHub
- Push your code to GitHub:
  ```sh
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/your-username/hookfinder3.git
  git push -u origin main
  ```

### Netlify
- Connect your GitHub repository to Netlify.
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variable `VITE_OPENAI_API_KEY` in Netlify dashboard.
- Deploy!

## Features
- Video upload (local file)
- YouTube video processing (via Netlify backend)
- OpenAI-powered transcript analysis
- Hook detection and display