import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ProcessingOptions } from '../types';

interface SettingsPanelProps {
  options: ProcessingOptions;
  onOptionsChange: (options: ProcessingOptions) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ options, onOptionsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
};