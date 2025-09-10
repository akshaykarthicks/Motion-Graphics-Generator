
import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import type { FormState } from './types';
import { generateAnimation } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(Date.now()); // Used to reset the form

  const handleGenerate = async (settings: FormState, image: { data: string; mimeType: string } | null) => {
    if (!image) {
      setError('Please upload an image to generate an animation.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const generatedUrl = await generateAnimation(settings, image);
      setVideoUrl(generatedUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setError(null);
    setVideoUrl(null);
    setFormKey(Date.now()); // Change key to force remount of InputForm
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InputForm key={formKey} onGenerate={handleGenerate} disabled={isLoading} />
          <div className="lg:sticky lg:top-8 bg-gray-800 rounded-xl shadow-2xl p-6 min-h-[30rem] flex flex-col justify-center items-center">
            {isLoading && <LoadingIndicator />}
            {error && !isLoading && (
              <div className="text-center text-red-400">
                <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                <p>{error}</p>
                <button
                    onClick={handleReset}
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Try Again
                </button>
              </div>
            )}
            {videoUrl && !isLoading && (
              <VideoPlayer videoUrl={videoUrl} onGenerateNew={handleReset} />
            )}
            {!isLoading && !error && !videoUrl && (
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold">Your Animation Will Appear Here</h3>
                <p className="mt-1 text-sm">Fill out the form and click "Generate Animation" to begin.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
