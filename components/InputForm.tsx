import React, { useState, useCallback } from 'react';
import { ANIMATION_STYLES, PACING_OPTIONS, COLOR_PALETTES, ASPECT_RATIOS } from '../constants';
import type { FormState, ImageData } from '../types';
import { UploadIcon } from './icons';

interface InputFormProps {
  onGenerate: (settings: FormState, image: ImageData | null) => void;
  disabled: boolean;
}

const defaultState: FormState = {
  text: "",
  style: ANIMATION_STYLES[0],
  pacing: PACING_OPTIONS[1],
  duration: 10,
  palette: COLOR_PALETTES[0],
  aspectRatio: ASPECT_RATIOS[0],
};

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, disabled }) => {
  const [formState, setFormState] = useState<FormState>(defaultState);
  const [image, setImage] = useState<ImageData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage({ data: base64, mimeType: file.type });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(formState, image);
  };

  const renderSelect = <T extends string>(id: string, label: string, options: readonly T[], value: T, key: keyof FormState) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => handleChange(key, e.target.value as FormState[keyof FormState])}
        disabled={disabled}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-6 rounded-xl shadow-2xl">
      <fieldset>
        <legend className="text-lg font-semibold text-white mb-4">1. Upload Source Image</legend>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
            ) : (
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-400">
              <label htmlFor="image-upload-input" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-2 py-1">
                <span>Upload a file</span>
                <input id="image-upload-input" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={disabled} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-gray-700 pt-6">
        <legend className="text-lg font-semibold text-white mb-4">2. Define Animation & Edits</legend>
        <div className="space-y-6">
          {renderSelect('style-select', 'Base Animation Style', ANIMATION_STYLES, formState.style, 'style')}
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-1">Image Edit Commands (Optional)</label>
             <p className="text-xs text-gray-400 mb-2">Describe edits to apply during the animation. These will be combined with the base animation style.</p>
            <textarea
              id="text-input"
              rows={3}
              value={formState.text}
              onChange={(e) => handleChange('text', e.target.value)}
              disabled={disabled}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g., 'add a futuristic helmet', 'make the background a cyberpunk city'"
            />
          </div>
        </div>
      </fieldset>
      
      <fieldset className="border-t border-gray-700 pt-6">
         <legend className="text-lg font-semibold text-white mb-4">3. Refine Technical Details</legend>
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSelect('pacing-select', 'Pacing & Timing', PACING_OPTIONS, formState.pacing, 'pacing')}
                {renderSelect('palette-select', 'Color Palette', COLOR_PALETTES, formState.palette, 'palette')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {renderSelect('aspect-ratio-select', 'Aspect Ratio', ASPECT_RATIOS, formState.aspectRatio, 'aspectRatio')}
                <div>
                    <label htmlFor="duration-slider" className="block text-sm font-medium text-gray-300 mb-2">Duration: {formState.duration}s</label>
                    <input
                      id="duration-slider"
                      type="range"
                      min="3"
                      max="30"
                      value={formState.duration}
                      onChange={(e) => handleChange('duration', parseInt(e.target.value, 10))}
                      disabled={disabled}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            </div>
         </div>
      </fieldset>

      <button
        type="submit"
        disabled={disabled || !image}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {disabled ? 'Generating...' : 'Generate Animation'}
      </button>
    </form>
  );
};