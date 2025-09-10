
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';
import { SpinnerIcon } from './icons';

export const LoadingIndicator: React.FC = () => {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = LOADING_MESSAGES.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
        return LOADING_MESSAGES[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <SpinnerIcon className="mx-auto h-12 w-12 text-indigo-400" />
      <h3 className="mt-4 text-xl font-semibold text-white">Generating Your Animation</h3>
      <p className="mt-2 text-sm text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};
