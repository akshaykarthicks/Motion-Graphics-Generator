import React from 'react';
import { GithubIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/50 backdrop-blur-lg border-t border-gray-700/50 py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <a href="https://github.com/akshaykarthicks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <GithubIcon className="h-6 w-6" />
        </a>
      </div>
    </footer>
  );
};
