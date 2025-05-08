import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm">
        <p>HookFinder © {new Date().getFullYear()} - Powered by OpenAI</p>
        <p className="mt-1">Convert videos to insights with AI analysis</p>
      </div>
    </footer>
  );
}