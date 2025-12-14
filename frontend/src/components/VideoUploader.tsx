import axios from "axios";
import { useState, useRef } from "react";

const API = "https://vidbackend-4.onrender.com";

interface VideoUploaderProps {
  onUpload?: (path: string) => void;
  onStart?: () => void;
  onError?: () => void;
}

export default function VideoUploader({ onUpload, onStart, onError }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFileName(file.name);
      onStart?.();
      
      const fd = new FormData();
      fd.append("video", file);

      const res = await axios.post(`${API}/upload`, fd);
      onUpload?.(res.data.videoPath);
      
      // Reset after successful upload
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      onError?.();
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <input
        type="file"
        accept="video/mp4"
        onChange={upload}
        ref={fileInputRef}
        className="hidden"
        disabled={isUploading}
      />
      
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isUploading
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        } text-white shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {isUploading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Video
          </>
        )}
      </button>
      
      {fileName && (
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 min-w-[250px]">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-gray-700 truncate max-w-[180px]">{fileName}</span>
          {isUploading && (
            <div className="ml-2 flex-1 h-1 bg-gray-300 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse w-full"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}