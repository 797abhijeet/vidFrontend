import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const Root = () => (
  <Composition
    id="CaptionedVideo"
    component={CaptionedVideo}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
  />
);
