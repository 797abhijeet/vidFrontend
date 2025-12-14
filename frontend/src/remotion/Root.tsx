import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

type Caption = {
  start: number;
  end: number;
  text: string;
};

type InputProps = {
  videoPath: string;
  captions: Caption[];
  style: "top" | "bottom" | "karaoke";
};

export const Root = () => (
  <Composition
    id="CaptionedVideo"
    component={CaptionedVideo}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{
      videoPath: "",
      captions: [] as Caption[],
      style: "bottom" as const,
    }}
    calculateMetadata={({ props }) => {
      const { captions } = props as InputProps;

      const fps = 30;
      const lastEnd =
        captions.length > 0
          ? captions[captions.length - 1].end
          : 10;

      return {
        durationInFrames: Math.ceil(lastEnd * fps) + 30,
        fps,
        width: 1280,
        height: 720,
      };
    }}
  />
);