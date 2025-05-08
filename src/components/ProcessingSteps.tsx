import React from 'react';
import { 
  FileUpIcon, 
  MicIcon, 
  BrainCircuitIcon, 
  ZapIcon, 
  Loader2Icon 
} from 'lucide-react';

interface ProcessingStepsProps {
  currentStep: number;
  transcriptionProgress: number;
  analysisProgress: number;
}

export function ProcessingSteps({ 
  currentStep, 
  transcriptionProgress, 
  analysisProgress 
}: ProcessingStepsProps) {
  const steps = [
    { 
      id: 1, 
      name: 'Upload Video', 
      icon: FileUpIcon,
      description: 'Select or upload your video file' 
    },
    { 
      id: 2, 
      name: 'Transcribe', 
      icon: MicIcon,
      description: 'Converting speech to text',
      progress: transcriptionProgress
    },
    { 
      id: 3, 
      name: 'Analyze', 
      icon: BrainCircuitIcon,
      description: 'Finding valuable hooks',
      progress: analysisProgress
    },
    { 
      id: 4, 
      name: 'Results', 
      icon: ZapIcon,
      description: 'Review extracted hooks' 
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-8 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 z-0" />
        
        {/* Active progress */}
        <div 
          className="absolute top-8 left-0 h-1 bg-violet-500 z-10 transition-all duration-500" 
          style={{ 
            width: `${Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100)}%` 
          }}
        />
        
        {/* Steps */}
        <div className="relative z-20 flex justify-between">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
            >
              <div 
                className={`flex items-center justify-center w-16 h-16 rounded-full 
                  ${currentStep >= step.id 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  } transition-colors duration-300`}
              >
                {currentStep === step.id && step.progress !== undefined && step.progress < 100 ? (
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`font-medium ${currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {step.description}
                </p>
                
                {/* Progress percentage for current step */}
                {currentStep === step.id && step.progress !== undefined && step.progress < 100 && (
                  <p className="text-xs text-violet-500 mt-1 font-medium">{step.progress}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}