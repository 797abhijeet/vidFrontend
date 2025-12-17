import { useEffect, useMemo, useRef, useState } from "react";
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
  const rafRef = useRef<number | null>(null);

  const [currentTime, setCurrentTime] = useState(0);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      setCurrentTime(video.currentTime);
      rafRef.current = requestAnimationFrame(update);
    };

    const onPlay = () => {
      rafRef.current = requestAnimationFrame(update);
    };

    const onPause = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  const currentCaption = useMemo(() => {
    for (let i = 0; i < captions.length; i++) {
      if (currentTime >= captions[i].start && currentTime <= captions[i].end) {
        return captions[i];
      }
    }
    return null;
  }, [currentTime, captions]);

  if (!videoPath) return null;

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={videoPath}
        controls
        className="w-full h-full object-contain"
      />

      {/* Caption Overlay */}
      {currentCaption && (
        <div
          className={`absolute left-0 right-0 text-center text-white pointer-events-none
            ${style === "top" ? "top-4" : "bottom-16"}`}
          style={{ textShadow: "2px 2px 8px black" }}
        >
          <div className="inline-block bg-black/60 px-6 py-3 rounded-lg">
            {currentCaption.text}
          </div>
        </div>
      )}

     
    </div>
  );
}
