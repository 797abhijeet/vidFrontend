import { Video, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansDevanagari";

loadFont();

export const CaptionedVideo = ({
  videoPath,
  captions,
  style,
}: any) => {
  const frame = useCurrentFrame();
  const time = frame / 30;

  const caption = captions.find(
    (c: any) => time >= c.start && time <= c.end
  );

  return (
    <>
      <Video src={videoPath} />
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: style === "bottom" ? 80 : undefined,
            top: style === "top" ? 20 : undefined,
            width: "100%",
            textAlign: "center",
            fontFamily:
              "Noto Sans Devanagari, Noto Sans, sans-serif",
            fontSize: 42,
            color: "white",
            textShadow: "2px 2px 6px black",
          }}
        >
          {caption.text}
        </div>
      )}
    </>
  );
};
