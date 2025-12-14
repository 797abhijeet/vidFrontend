import { Video, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansDevanagari";

loadFont();

type Caption = {
  start: number;
  end: number;
  text: string;
};

export const CaptionedVideo = ({
  videoPath,
  captions,
  style,
}: {
  videoPath: string;
  captions: Caption[];
  style: "top" | "bottom" | "karaoke";
}) => {
  const frame = useCurrentFrame();
  const time = frame / 30;

  const caption = captions.find(
    (c) => time >= c.start && time <= c.end
  );

  return (
    <div className="relative w-full h-full">
      <Video
        src={videoPath}
        startFrom={0}
        onError={(e) => {
          console.error("❌ Video error:", e);
        }}
        className="w-full h-full object-contain"
      />

      {caption && (
        <div
          className={`absolute w-full text-center font-['Noto_Sans_Devanagari',sans-serif] text-4xl text-white drop-shadow-[2px_2px_6px_rgba(0,0,0,1)] pointer-events-none ${
            style === "bottom" ? "bottom-20" : 
            style === "top" ? "top-5" : ""
          }`}
        >
          {caption.text}
        </div>
      )}
    </div>
  );
};