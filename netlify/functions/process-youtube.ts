import { Handler } from '@netlify/functions';
import { processYoutubeVideo } from '../../src/services/youtube';

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

    // Use backend's own OpenAI API key from environment
    // (No longer set from request)

    const videoInfo = await processYoutubeVideo(url);
    
    return {
      statusCode: 200,
      body: JSON.stringify(videoInfo)
    };
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 