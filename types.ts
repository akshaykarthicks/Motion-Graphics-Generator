
export interface FormState {
  text: string;
  style: string;
  pacing: string;
  duration: number;
  palette: string;
  aspectRatio: string;
}

export interface ImageData {
    data: string; // base64 encoded
    mimeType: string;
}
