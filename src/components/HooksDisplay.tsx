import React, { useState } from 'react';
import { Hook } from '../types';
import { Zap, Download, Copy, CheckIcon } from 'lucide-react';

interface HooksDisplayProps {
  hooks: Hook[];
  totalDuration: number;
}

export function HooksDisplay({ hooks, totalDuration }: HooksDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  if (hooks.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: Hook['type']) => {
    switch (type) {
      case 'emotional_spike':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Emotional</span>;
      case 'surprise':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Surprise</span>;
      case 'value_bomb':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Value</span>;
      default:
        return null;
    }
  };

  const handleCopyTimestamp = (hook: Hook) => {
    const text = `${formatTime(hook.startTime)} - ${formatTime(hook.endTime)}: ${hook.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(hook.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportHooks = () => {
    const hooksText = hooks.map(hook => 
      `${formatTime(hook.startTime)} - ${formatTime(hook.endTime)}: ${hook.description} [${hook.type}]`
    ).join('\n\n');
    
    const blob = new Blob([hooksText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-hooks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-violet-500" />
            <h3 className="font-medium">Detected Hooks</h3>
          </div>
          <button
            onClick={exportHooks}
            className="text-sm flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        
        {/* Timeline visualization */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative h-8 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
            {hooks.map((hook) => (
              <div
                key={hook.id}
                className={`absolute h-full ${
                  hook.type === 'emotional_spike' ? 'bg-red-400' :
                  hook.type === 'surprise' ? 'bg-blue-400' :
                  'bg-green-400'
                } opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                style={{
                  left: `${(hook.startTime / totalDuration) * 100}%`,
                  width: `${((hook.endTime - hook.startTime) / totalDuration) * 100}%`,
                }}
                title={`${formatTime(hook.startTime)} - ${hook.description}`}
              />
            ))}
            
            {/* Time markers */}
            {[0, 0.25, 0.5, 0.75, 1].map((percentage) => (
              <div
                key={percentage}
                className="absolute bottom-0 text-xs text-slate-500 dark:text-slate-400"
                style={{ left: `${percentage * 100}%`, transform: 'translateX(-50%)' }}
              >
                {formatTime(percentage * totalDuration)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {hooks.map((hook) => (
            <div 
              key={hook.id}
              className="p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-mono text-sm text-violet-500 mr-2">
                      {formatTime(hook.startTime)} - {formatTime(hook.endTime)}
                    </span>
                    {getTypeIcon(hook.type)}
                    <div className="ml-2 w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                      <div 
                        className="bg-violet-500 h-1.5 rounded-full" 
                        style={{ width: `${hook.confidence}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">{hook.description}</p>
                </div>
                <button
                  onClick={() => handleCopyTimestamp(hook)}
                  className="ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {copiedId === hook.id ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}