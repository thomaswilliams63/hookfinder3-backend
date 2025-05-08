import React, { useState } from 'react';
import { Transcript } from '../types';
import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: Transcript[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function TranscriptDisplay({ 
  transcript, 
  isVisible,
  onToggleVisibility
}: TranscriptDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const filteredTranscript = searchTerm 
    ? transcript.filter(segment => 
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transcript;

  if (transcript.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
        onClick={onToggleVisibility}
      >
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-violet-500" />
          <h3 className="font-medium">Full Transcript</h3>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
            {transcript.length} segments
          </span>
          {isVisible 
            ? <ChevronUpIcon className="h-5 w-5" /> 
            : <ChevronDownIcon className="h-5 w-5" />
          }
        </div>
      </div>
      
      {isVisible && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <input
              type="text"
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-800 mb-4"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto px-4 pb-4">
            {filteredTranscript.length > 0 ? (
              <div className="space-y-3">
                {filteredTranscript.map((segment, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex">
                      <span className="text-violet-500 font-mono text-sm w-16 flex-shrink-0">
                        {formatTime(segment.startTime)}
                      </span>
                      <p className="flex-1">{segment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-500 dark:text-slate-400">
                No results found for "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}