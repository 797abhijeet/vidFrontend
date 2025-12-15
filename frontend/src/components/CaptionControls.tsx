import axios from "axios";
import { useState } from "react";
import { Caption, CaptionStyle } from "../types"; // ✅ Import types

interface CaptionControlsProps {
  videoPath: string;
  onCaptions: (captions: Caption[]) => void;
  onStyleChange: (style: CaptionStyle) => void; // ✅ Use imported type
  onStart?: () => void;
  onError?: (message?: string) => void;
}

export default function CaptionControls({
  videoPath,
  onCaptions,
  onStyleChange,
  onStart,
  onError,
}: CaptionControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    if (!videoPath) {
      onError?.("Please upload a video first");
      return;
    }

    try {
      setIsGenerating(true);
      onStart?.();
      const res = await axios.post(
        "https://vidbackend-4.onrender.com/captions",
        { videoPath }
      );
      onCaptions?.(res.data.captions as Caption[]);
    } catch (err: any) {
      console.error(err);
      onError?.(
        err?.response?.data?.error ||
        err?.message ||
        "Caption generation failed"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={generate}
        disabled={isGenerating || !videoPath}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isGenerating
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        } text-white shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-500`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m5-11H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
            Generate Captions
          </>
        )}
      </button>

      <select
        onChange={(e) => {
          const value = e.target.value as CaptionStyle;
          onStyleChange?.(value);
        }}
        className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 bg-white cursor-pointer transition-all duration-200 hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none appearance-none  bg-no-repeat bg-right-3 bg-origin-content pr-10 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-300"
        disabled={isGenerating}
        defaultValue="bottom"
      >
        <option value="bottom">Bottom</option>
        <option value="top">Top</option>
        <option value="karaoke">Karaoke</option>
      </select>
    </div>
  );
}