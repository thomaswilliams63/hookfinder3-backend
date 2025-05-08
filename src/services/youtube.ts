import { VideoInfo } from '../types';

export async function isValidYouTubeUrl(url: string): Promise<boolean> {
  const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return regExp.test(url);
}

export async function extractVideoId(url: string): Promise<string | null> {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function fetchVideoInfo(videoId: string): Promise<VideoInfo> {
  // Note: In a real application, you would use a server-side API to fetch this information
  // For demo purposes, we'll create a mock implementation
  
  // This is a placeholder - in production, you would integrate with YouTube Data API
  // which requires authentication and proper API calls from a server
  
  return {
    title: `YouTube Video (${videoId})`,
    duration: 600, // 10 minutes in seconds
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
}

export async function downloadAudioFromYouTube(
  videoId: string
): Promise<Blob> {
  try {
    // Note: This is a mock implementation
    // In a real application, you would need a server-side component to download YouTube videos
    // as this cannot be done purely client-side due to CORS and legal restrictions
    
    throw new Error(
      'YouTube audio download requires server integration. ' +
      'Please implement a server-side solution for production use.'
    );
    
    // The server would typically:
    // 1. Use youtube-dl or similar library to download the video
    // 2. Extract the audio track
    // 3. Convert to desired format (MP3)
    // 4. Return the blob
    
  } catch (error) {
    console.error('YouTube download error:', error);
    throw error;
  }
}