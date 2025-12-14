import axios from "axios";
import { useState, useRef } from "react";

const API = "https://vidbackend-4.onrender.com";

export default function VideoUploader({ onUpload, onStart, onError }) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFileName(file.name);
      onStart && onStart();
      
      const fd = new FormData();
      fd.append("video", file);

      const res = await axios.post(`${API}/upload`, fd);
      onUpload && onUpload(res.data.videoPath);
      
      // Reset after successful upload
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      onError && onError();
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="video-uploader">
      <input
        type="file"
        accept="video/mp4"
        onChange={upload}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={isUploading}
      />
      
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`upload-button ${isUploading ? "uploading" : ""}`}
      >
       
          <>
           
            Upload Video
          </>
       
      </button>
      
     
      
      <style jsx>{`
        .video-uploader {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        
        .upload-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .upload-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
        
        .upload-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .upload-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
        }
        
        .upload-button.uploading {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background-color: #f3f4f6;
          border-radius: 8px;
          min-width: 250px;
          border: 1px solid #e5e7eb;
        }
        
        .file-name {
          flex: 1;
          font-size: 14px;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        
        .progress-indicator {
          flex: 1;
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-left: 8px;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          animation: progress 2s ease-in-out infinite;
        }
        
        @keyframes progress {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 100%;
            transform: translateX(0%);
          }
          100% {
            width: 0%;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}