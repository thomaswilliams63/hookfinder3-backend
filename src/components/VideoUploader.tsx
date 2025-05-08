import React, { useState, useRef } from 'react';
import { UploadCloudIcon, YoutubeIcon, X } from 'lucide-react';
import { VideoInfo } from '../types';
import { isValidYouTubeUrl, extractVideoId, fetchVideoInfo } from '../services/youtube';

interface VideoUploaderProps {
  onVideoSelected: (file: File | null, videoInfo: VideoInfo | null, youtubeUrl: string | null) => void;
}

export function VideoUploader({ onVideoSelected }: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is video
    if (!file.type.match('video.*')) {
      alert('Please upload a video file');
      return;
    }
    
    setFile(file);
    setYoutubeUrl('');
    setUrlError('');
    setVideoInfo(null);
    
    // Create video info for local file
    const localVideoInfo: VideoInfo = {
      title: file.name,
      duration: 0, // We don't know the duration yet
    };
    
    onVideoSelected(file, localVideoInfo, null);
  };

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      setUrlError('Please enter a YouTube URL');
      return;
    }
    
    const valid = await isValidYouTubeUrl(youtubeUrl);
    if (!valid) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }
    
    try {
      const videoId = await extractVideoId(youtubeUrl);
      if (!videoId) {
        setUrlError('Could not extract video ID from URL');
        return;
      }
      
      const info = await fetchVideoInfo(videoId);
      setVideoInfo(info);
      setFile(null);
      setUrlError('');
      
      onVideoSelected(null, info, youtubeUrl);
    } catch (error) {
      setUrlError('Error processing YouTube URL. Please try again.');
      console.error(error);
    }
  };

  const handleClear = () => {
    setFile(null);
    setYoutubeUrl('');
    setUrlError('');
    setVideoInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onVideoSelected(null, null, null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!(file || videoInfo) ? (
        <div className="space-y-8">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 ${
              dragActive ? 'border-violet-500 bg-violet-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'
            } transition-colors duration-200 text-center cursor-pointer`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="video/*"
              onChange={handleChange}
            />
            <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop a video file</p>
            <p className="text-slate-500 dark:text-slate-400 mb-4">or click to browse</p>
            <p className="text-xs text-slate-400">Supported formats: MP4, WebM, MOV, AVI</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <YoutubeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-16 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-800"
                  placeholder="Or enter YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setUrlError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleYoutubeSubmit();
                    }
                  }}
                />
                <button
                  className="absolute right-2 top-2 px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors"
                  onClick={handleYoutubeSubmit}
                >
                  Analyze
                </button>
              </div>
              {urlError && (
                <p className="mt-2 text-red-500 text-sm">{urlError}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Selected Video</h3>
            <button
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              onClick={handleClear}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center">
            {videoInfo?.thumbnailUrl ? (
              <img 
                src={videoInfo.thumbnailUrl} 
                alt={videoInfo.title}
                className="w-24 h-16 object-cover rounded mr-4"
              />
            ) : (
              <div className="w-24 h-16 bg-slate-200 dark:bg-slate-700 rounded mr-4 flex items-center justify-center">
                <YoutubeIcon className="h-8 w-8 text-slate-400" />
              </div>
            )}
            
            <div>
              <p className="font-medium">{videoInfo?.title || file?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {file 
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                  : videoInfo?.duration 
                    ? `${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}` 
                    : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}