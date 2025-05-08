import React, { useState } from 'react';
import { KeyIcon, SlidersHorizontal } from 'lucide-react';
import { ProcessingOptions } from '../types';

interface SettingsPanelProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  options: ProcessingOptions;
  onOptionsChange: (options: ProcessingOptions) => void;
}

export function SettingsPanel({ 
  apiKey, 
  onApiKeyChange,
  options,
  onOptionsChange
}: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleNumHooksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onOptionsChange({
      ...options,
      numHooks: value
    });
  };

  const handleMinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onOptionsChange({
      ...options,
      minHookDuration: value
    });
  };

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onOptionsChange({
      ...options,
      maxHookDuration: value
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden transition-all duration-300">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-violet-500" />
          <h3 className="font-medium">Processing Settings</h3>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {isExpanded ? 'Hide' : 'Show'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-6">
            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <KeyIcon className="h-4 w-4 mr-2 text-slate-500" />
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-800"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs mt-1 text-slate-500">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
            
            {/* Number of Hooks */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Hooks to Extract
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={options.numHooks}
                  onChange={handleNumHooksChange}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-violet-500"
                />
                <span className="w-6 text-center">{options.numHooks}</span>
              </div>
            </div>
            
            {/* Min Hook Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Hook Duration (seconds)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={options.minHookDuration}
                  onChange={handleMinDurationChange}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-violet-500"
                />
                <span className="w-6 text-center">{options.minHookDuration}s</span>
              </div>
            </div>
            
            {/* Max Hook Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Hook Duration (seconds)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={options.maxHookDuration}
                  onChange={handleMaxDurationChange}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-violet-500"
                />
                <span className="w-8 text-center">{options.maxHookDuration}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}