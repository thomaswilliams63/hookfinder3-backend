import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VideoUploader } from './components/VideoUploader';
import { SettingsPanel } from './components/SettingsPanel';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { HooksDisplay } from './components/HooksDisplay';
import { ProcessingSteps } from './components/ProcessingSteps';
import { useTranscription } from './hooks/useTranscription';
import { useAnalysis } from './hooks/useAnalysis';
import { Hook, ProcessingOptions, Transcript, VideoInfo } from './types';
import { AlertTriangleIcon } from 'lucide-react';
import { processYoutubeVideo } from './services/youtube';

// Get API key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not set. Please add VITE_OPENAI_API_KEY to your .env file');
}

function App() {
  // Local storage keys
  const PROCESSING_OPTIONS_STORAGE_KEY = 'hook-finder-processing-options';

  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({
    numHooks: 5,
    minHookDuration: 5,
    maxHookDuration: 30
  });

  // Hooks
  const transcription = useTranscription();
  const analysis = useAnalysis('gpt-4');

  // Effects

  // Load options from local storage
  useEffect(() => {
    const savedOptions = localStorage.getItem(PROCESSING_OPTIONS_STORAGE_KEY);
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (e) {
        console.error('Error parsing saved options:', e);
      }
    }
  }, []);

  // Save options to local storage when they change
  useEffect(() => {
    localStorage.setItem(PROCESSING_OPTIONS_STORAGE_KEY, JSON.stringify(options));
  }, [options]);

  // Handlers
  const handleVideoSelected = (
    file: File | null, 
    info: VideoInfo | null, 
    url: string | null
  ) => {
    setSelectedFile(file);
    setVideoInfo(info);
    setYoutubeUrl(url);
    setCurrentStep(1);
    setError(null);
  };

  const handleOptionsChange = (newOptions: ProcessingOptions) => {
    setOptions(newOptions);
  };

  const startProcessing = async () => {
    if (!selectedFile && !youtubeUrl) {
      setError('Please select a video file or enter a YouTube URL');
      return;
    }

    setError(null);

    try {
      // Step 2: Transcription
      setCurrentStep(2);
      
      if (selectedFile) {
        const { transcript } = await transcription.startTranscription(selectedFile, OPENAI_API_KEY);
        // Step 3: Analysis
        setCurrentStep(3);
        const hooks = await analysis.startAnalysis(transcript, options.numHooks, OPENAI_API_KEY);
        // Step 4: Results
        setCurrentStep(4);
      } else if (youtubeUrl) {
        const videoInfo = await processYoutubeVideo(youtubeUrl, OPENAI_API_KEY);
        setVideoInfo(videoInfo);
        // Step 3: Analysis
        setCurrentStep(3);
        const hooks = await analysis.startAnalysis(videoInfo.transcript, options.numHooks, OPENAI_API_KEY);
        // Step 4: Results
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <Header />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <ProcessingSteps 
          currentStep={currentStep} 
          transcriptionProgress={transcription.progress}
          analysisProgress={analysis.progress}
        />
        
        {error && (
          <div className="w-full max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start">
            <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {currentStep === 1 && (
            <>
              <VideoUploader onVideoSelected={handleVideoSelected} />
              
              <SettingsPanel 
                options={options}
                onOptionsChange={handleOptionsChange}
              />
              
              {(selectedFile || youtubeUrl) && (
                <div className="w-full max-w-3xl mx-auto">
                  <button
                    onClick={startProcessing}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    Start Processing
                  </button>
                </div>
              )}
            </>
          )}
          
          {transcription.transcript.length > 0 && (
            <TranscriptDisplay 
              transcript={transcription.transcript}
              isVisible={showTranscript}
              onToggleVisibility={() => setShowTranscript(!showTranscript)}
            />
          )}
          
          {analysis.hooks.length > 0 && (
            <HooksDisplay 
              hooks={analysis.hooks}
              totalDuration={videoInfo?.duration || 600}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;