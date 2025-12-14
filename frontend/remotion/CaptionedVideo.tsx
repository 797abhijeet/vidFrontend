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
    <>
      <Video
        src={videoPath}
        startFrom={0}
        onError={(e) => {
          console.error("❌ Video error:", e);
        }}
      />

      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: style === "bottom" ? 80 : undefined,
            top: style === "top" ? 20 : undefined,
            width: "100%",
            textAlign: "center",
            fontFamily: "Noto Sans Devanagari, sans-serif",
            fontSize: 42,
            color: "white",
            textShadow: "2px 2px 6px black",
            pointerEvents: "none",
          }}
        >
          {caption.text}
        </div>
      )}
    </>
  );
};