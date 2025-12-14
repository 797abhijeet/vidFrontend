import { Player } from "@remotion/player";
import { CaptionedVideo } from "../remotion/CaptionedVideo";

export default function VideoPreview({
  videoPath,
  captions,
  style,
}: {
  videoPath: string;
  captions: any[];
  style: "top" | "bottom" | "karaoke";
}) {
  if (!videoPath) return null;

  return (
    <Player
      key={videoPath} // 🔁 remount when video changes
      component={CaptionedVideo}
      inputProps={{ videoPath, captions, style }}
      durationInFrames={Math.max(300, captions.length * 30)} // 🧠 adaptive duration
      fps={30}
      compositionWidth={1280}
      compositionHeight={720}
      controls
      errorFallback={({ error }) => (
        <div
          style={{
            color: "white",
            background: "black",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            textAlign: "center",
          }}
        >
          <div>
            <h3>❌ Video playback failed</h3>
            <p style={{ opacity: 0.8 }}>
              Please upload a standard MP4 video (H.264 + AAC).
            </p>
            <pre style={{ fontSize: 12, opacity: 0.6 }}>
              {String(error?.message || error)}
            </pre>
          </div>
        </div>
      )}
     
    />
  );
}