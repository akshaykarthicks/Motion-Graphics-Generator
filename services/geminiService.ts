
import { GoogleGenAI } from "@google/genai";
import type { FormState, ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (settings: FormState): string => {
  const { text, style, pacing, duration, palette, aspectRatio } = settings;
  const aspectRatioValue = aspectRatio.split(' ')[0]; // "16:9" from "16:9 (Landscape)"

  const mainInstruction = text.trim()
    ? `The animation must prominently feature the provided image, but with the following creative edits applied during the animation: "${text}".`
    : `The animation must prominently feature the provided image.`;


  return `
    Generate a professional, high-quality motion graphics animation with a ${aspectRatioValue} aspect ratio.
    The total duration should be exactly ${duration} seconds.
    ${mainInstruction}
    The overall animation style must be "${style}".
    The pacing should be "${pacing}".
    The color palette should be inspired by "${palette}".
    Ensure all transitions are smooth, the visuals are polished, and the final output is of professional quality.
    Do not include any sound or audio track.
  `;
};

export const generateAnimation = async (settings: FormState, image: ImageData): Promise<string> => {
  const prompt = createPrompt(settings);

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: image.data,
        mimeType: image.mimeType,
      },
      config: {
        numberOfVideos: 1,
      }
    });

    // Poll for the result
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation completed but returned no downloadable link.");
    }
    
    // Fetch the video as a blob to create an object URL.
    // This is more secure than exposing the API key in a URL in the DOM.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch video from storage URI: ${response.statusText}. Body: ${errorBody}`);
    }

    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Error in generateAnimation:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
