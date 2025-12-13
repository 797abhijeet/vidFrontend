// frontend/components/remotion/CaptionedVideo.jsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, Audio, Video } from "remotion";

export const CaptionedVideo = ({ videoPath, captions, style }) => {
  const frame = useCurrentFrame();
  const time = frame / 30;

  if (!videoPath) {
    return null;
  }

  const currentCaption = captions?.find(
    (c) => time >= c.start && time <= c.end
  ) || null;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video 
        src={videoPath} 
        volume={1}
        style={{ width: "100%", height: "100%" }}
      />
      <Audio src={videoPath} volume={1} />
      
      {currentCaption && (
        <div
          style={{
            position: "absolute",
            bottom: style === "bottom" ? 80 : style === "top" ? "auto" : "auto",
            top: style === "top" ? 40 : "auto",
            width: "100%",
            textAlign: "center",
            fontFamily: "'Noto Sans Devanagari', Arial, sans-serif",
            fontSize: 42,
            color: "white",
            textShadow: "2px 2px 6px black",
            padding: "10px",
          }}
        >
          {currentCaption.text}
        </div>
      )}
    </AbsoluteFill>
  );
};