import axios from "axios";
import { useState } from "react";

export default function CaptionControls({
  videoPath,
  onCaptions,
  onStyleChange,
  onStart,
  onError,
}) {
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
      onCaptions?.(res.data.captions);
    } catch (err) {
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
    <div className="caption-controls">
      <button
        onClick={generate}
        disabled={isGenerating || !videoPath}
        className={`caption-button ${isGenerating ? "generating" : ""}`}
      >
        {isGenerating ? (
          <>
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-3-3v6m5-11H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            </svg>
            Generate Captions
          </>
        )}
      </button>

      <select 
        onChange={(e) => onStyleChange?.(e.target.value)}
        className="style-dropdown"
        disabled={isGenerating}
      >
        <option value="bottom">Bottom</option>
        <option value="top">Top</option>
        <option value="karaoke">Karaoke</option>
      </select>

      <style jsx>{`
        .caption-controls {
          display: flex;
          gap: 450px;
          align-items: center;
        }
        
        .caption-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        
        .caption-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }
        
        .caption-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .caption-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          box-shadow: 0 4px 15px rgba(156, 163, 175, 0.2);
        }
        
        .caption-button.generating {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        .caption-button.generating:hover:not(:disabled) {
          background: linear-gradient(135deg, #e68a09 0%, #c46205 100%);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .style-dropdown {
          padding: 12px 16px;
          padding-right: 40px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 140px;
          appearance: none;
        }
        
        .style-dropdown:hover:not(:disabled) {
          border-color: #8b5cf6;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
        }
        
        .style-dropdown:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .style-dropdown:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}