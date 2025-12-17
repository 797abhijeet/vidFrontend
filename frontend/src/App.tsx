import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import CaptionControls from "./components/CaptionControls";
import Loader from "./components/Loader";
import VideoPreview from "./components/VideoPreview";
import { Status, CaptionStyle, Caption } from "./types";

const API = process.env.REACT_APP_API_URL || "https://vidbackend-4.onrender.com";

function App() {
  const [videoPath, setVideoPath] = useState<string>("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [style, setStyle] = useState<CaptionStyle>("bottom");


  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("");



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Captionify Studio
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Add subtitle to your videos 
          </p>
        </header>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Status Area */}
              <div className="mb-8">
                {(status === "uploading" || status === "captioning" || status === "rendering") && (
                  <Loader text={statusText} />
                )}

                {status === "error" && (
                  <div className="flex items-center justify-center p-4 bg-red-900/30 border border-red-500/30 rounded-xl">
                    <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-300 font-medium">{statusText}</span>
                  </div>
                )}

                {status === "done" && !statusText.includes("download") && (
                  <div className="flex items-center justify-center p-4 bg-green-900/30 border border-green-500/30 rounded-xl">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-300 font-medium">{statusText}</span>
                  </div>
                )}
              </div>

              {/* Steps Container */}
              <div className="space-y-8">
                {/* STEP 1: UPLOAD */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg mr-4">
                      1
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Upload Video</h2>
                      <p className="text-gray-400">Select or drag & drop your video file</p>
                    </div>
                  </div>
                  <VideoUploader
                    onStart={() => {
                      setStatus("uploading");
                      setStatusText("Uploading video...");
                    }}
                    onUpload={(path) => {
                      const fullVideoPath = path.startsWith('http')
                        ? path
                        : `${API}${path}`;
                      setVideoPath(fullVideoPath);
                      setCaptions([]);
                      setStatus("done");
                      setStatusText("Video uploaded");
                    }}
                    onError={() => {
                      setStatus("error");
                      setStatusText("Upload failed");
                    }}
                  />
                </div>

                {/* STEP 2: CAPTIONS */}
                {videoPath && (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg mr-4">
                        2
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Customize Captions</h2>
                        <p className="text-gray-400">Generate and style your video captions</p>
                      </div>
                    </div>
                    <CaptionControls
                      videoPath={videoPath}
                      onStart={() => {
                        setStatus("captioning");
                        setStatusText("Generating captions...");
                      }}
                      onCaptions={(c) => {
                        setCaptions(c);
                        setStatus("done");
                        setStatusText("✅ Captions ready");
                      }}
                      onStyleChange={setStyle}
                      onError={() => {
                        setStatus("error");
                        setStatusText("❌ Caption generation failed");
                      }}
                    />
                  </div>
                )}

                {/* PREVIEW SECTION */}
                {videoPath && captions.length > 0 && (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg mr-4">
                        3
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Preview </h2>
                        <p className="text-gray-400">Preview your video and download the final version</p>
                      </div>
                    </div>
                    
                    {/* Preview Container */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                      <div className="relative bg-black rounded-xl overflow-hidden border border-white/10">
                        <VideoPreview
                          videoPath={videoPath}
                          captions={captions}
                          style={style}
                        />
                      </div>
                    </div>                    
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Captionify Studio • Add captions to videos effortlessly • Powered by AI</p>
            <p className="mt-1 text-gray-600">For best results, use MP4 videos under 500MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;