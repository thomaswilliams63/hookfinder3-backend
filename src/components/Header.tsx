import React from 'react';
import { HeadphonesIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-900 text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeadphonesIcon className="h-8 w-8 text-violet-500" />
          <h1 className="text-2xl font-bold">HookFinder</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-sm text-slate-400">
            Powered by OpenAI
          </div>
        </div>
      </div>
    </header>
  );
}