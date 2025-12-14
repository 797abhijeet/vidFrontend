export interface Caption {
  start: number;
  end: number;
  text: string;
}

export type Status = "idle" | "uploading" | "captioning" | "rendering" | "done" | "error";
export type CaptionStyle = "top" | "bottom" | "karaoke";

export interface RenderResponse {
  outputUrl: string;
  videoPath: string;
  success: boolean;
}