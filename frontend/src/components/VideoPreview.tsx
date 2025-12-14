import { useEffect, useRef, useState } from "react";
import { Caption, CaptionStyle } from "../types";

interface VideoPreviewProps {
  videoPath: string;
  captions: Caption[];
  style: CaptionStyle;
}

export default function VideoPreview({
  videoPath,
  captions,
  style,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get current caption based on time
  const currentCaption = captions.find(
    (c) => currentTime >= c.start && currentTime <= c.end
  );

  // Update current time when video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  if (!videoPath) return null;

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Video Player */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={videoPath}
          className="w-full h-full object-contain"
          controls
        />
        
        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePlayPause}
              className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <span className="text-white text-sm">
              {new Date(currentTime * 1000).toISOString().substr(11, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* Caption Overlay */}
      {currentCaption && (
        <div
          className={`absolute left-0 right-0 text-center font-sans text-2xl md:text-3xl lg:text-4xl text-white p-4 pointer-events-none
            ${style === "bottom" 
              ? "bottom-20" 
              : style === "top" 
                ? "top-4" 
                : "bottom-20"}`}
          style={{
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
            backgroundColor: style === "karaoke" ? "rgba(0,0,0,0.5)" : "transparent",
          }}
        >
          {style === "karaoke" ? (
            <div className="inline-block">
              {/* Karaoke style - highlight current word */}
              <span className="text-yellow-300 font-bold">
                {currentCaption.text}
              </span>
            </div>
          ) : (
            <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block max-w-4xl">
              {currentCaption.text}
            </div>
          )}
        </div>
      )}

      {/* Caption Progress Bar (for karaoke style) */}
      {style === "karaoke" && currentCaption && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-xl">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${((currentTime - currentCaption.start) / (currentCaption.end - currentCaption.start)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Debug info (optional) */}
      <div className="absolute top-2 left-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
        Caption Style: {style} | Time: {currentTime.toFixed(2)}s
      </div>
    </div>
  );
}