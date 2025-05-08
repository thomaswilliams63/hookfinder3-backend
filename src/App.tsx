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

function App() {
  // Local storage keys
  const OPENAI_API_KEY_STORAGE_KEY = 'hook-finder-openai-api-key';
  const PROCESSING_OPTIONS_STORAGE_KEY = 'hook-finder-processing-options';

  // State
  const [apiKey, setApiKey] = useState<string>('');
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
  const transcription = useTranscription(apiKey);
  const analysis = useAnalysis(apiKey, 'gpt-4');

  // Effects

  // Load API key from local storage
  useEffect(() => {
    const savedApiKey = localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    const savedOptions = localStorage.getItem(PROCESSING_OPTIONS_STORAGE_KEY);
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (e) {
        console.error('Error parsing saved options:', e);
      }
    }
  }, []);

  // Save API key to local storage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, apiKey);
    }
  }, [apiKey]);

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

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  const handleOptionsChange = (newOptions: ProcessingOptions) => {
    setOptions(newOptions);
  };

  const startProcessing = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key in the settings');
      return;
    }

    if (!selectedFile && !youtubeUrl) {
      setError('Please select a video file or enter a YouTube URL');
      return;
    }

    setError(null);

    try {
      // Step 2: Transcription
      setCurrentStep(2);
      
      // For the MVP, we'll process the local file directly
      // In a full implementation, we'd need a server to handle YouTube URLs
      if (selectedFile) {
        const { transcript } = await transcription.startTranscription(selectedFile);
        
        // Step 3: Analysis
        setCurrentStep(3);
        const hooks = await analysis.startAnalysis(transcript, options.numHooks);
        
        // Step 4: Results
        setCurrentStep(4);
      } else {
        // This is a placeholder - we'd need a server component to download from YouTube
        setError('YouTube processing requires a server component which is not implemented in this demo. Please upload a local video file instead.');
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
                apiKey={apiKey}
                onApiKeyChange={handleApiKeyChange}
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