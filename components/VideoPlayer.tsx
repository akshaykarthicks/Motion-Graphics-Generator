
import React from 'react';
import { DownloadIcon, RefreshIcon } from './icons';

interface VideoPlayerProps {
  videoUrl: string;
  onGenerateNew: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onGenerateNew }) => {
  return (
    <div className="w-full text-center">
      <h3 className="text-2xl font-bold mb-4 text-white">Animation Complete!</h3>
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-black shadow-lg">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full" />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href={videoUrl}
          download="motion-graphics-animation.mp4"
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
          Download Video
        </a>
        <button
          onClick={onGenerateNew}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-200 bg-indigo-900/50 hover:bg-indigo-900/80 transition-colors"
        >
          <RefreshIcon className="-ml-1 mr-2 h-5 w-5" />
          Generate Another
        </button>
      </div>
    </div>
  );
};
