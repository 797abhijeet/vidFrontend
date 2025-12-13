import { Player } from "@remotion/player";
import { CaptionedVideo } from "../remotion/CaptionedVideo";

export default function VideoPreview({ videoUrl, captions, style }) {
  return (
    <Player
      component={CaptionedVideo}
      inputProps={{
        videoPath: videoUrl,
        captions,
        style,
      }}
      durationInFrames={300}
      fps={30}
      compositionWidth={1280}
      compositionHeight={720}
      controls
    />
  );
}
