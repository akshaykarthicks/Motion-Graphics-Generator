
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Motion Graphics <span className="text-indigo-400">Generator</span>
        </h1>
        <p className="mt-1 text-gray-400">
          Transform your ideas into stunning animations with AI
        </p>
      </div>
    </header>
  );
};
