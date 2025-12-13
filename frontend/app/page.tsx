"use client";

import { useState } from "react";
import VideoUploader from "../components/VideoUploader";
import CaptionControls from "../components/CaptionControls";
import VideoPreview from "../components/VideoPreview";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState<any[]>([]);
  const [style, setStyle] = useState("bottom");

  const [status, setStatus] = useState<
    "idle" | "uploading" | "generating" | "ready" | "rendering" | "done" | "error"
  >("idle");

  const [error, setError] = useState("");
  const [outputVideo, setOutputVideo] = useState(""); // 👈 NEW

  return (
    <main style={{ padding: 20 }}>
      <h1>🎬 Remotion Captioning Platform</h1>

      {/* Upload */}
      <VideoUploader
        onUpload={(url: string) => {
          setVideoUrl(url);
          setCaptions([]);
          setOutputVideo("");
          setStatus("uploading");
        }}
      />

      {/* Status UI */}
      {status === "uploading" && (
        <p style={{ color: "blue" }}>✅ Video uploaded. Ready for captions.</p>
      )}

      {/* Caption Controls */}
      {videoUrl && (
        <CaptionControls
          videoPath={videoUrl}   // 👈 THIS WAS MISSING
          onStyleChange={setStyle}
          onCaptions={(caps) => {
            setCaptions(caps);
            setStatus("ready");
          }}
          onStart={() => {
            setStatus("generating");
            setError("");
          }}
          onError={(err) => {
            setStatus("error");
            setError(err);
          }}
        />

      )}

      {/* Loading indicator */}
      {status === "generating" && (
        <p style={{ color: "orange" }}>
          ⏳ Generating captions… please wait
        </p>
      )}

      {status === "rendering" && (
        <p style={{ color: "purple" }}>
          🎞️ Rendering final video… please wait
        </p>
      )}

      {/* Error */}
      {status === "error" && (
        <p style={{ color: "red" }}>❌ {error}</p>
      )}

      {/* Preview */}
      {videoUrl && captions.length > 0 && status === "ready" && (
        <>
          <h3>🎥 Preview</h3>

          <VideoPreview
            videoUrl={videoUrl}
            captions={captions}
            style={style}
          />

          {/* Render final video */}
          <button
            style={{ marginTop: 20 }}
            onClick={async () => {
              try {
                setStatus("rendering");

                const res = await fetch("https://vidbackend-3.onrender.com/render", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ captions, style }),
                });

                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.error || "Render failed");
                }

                const data = await res.json();

                /**
                 * Backend returns something like:
                 * backend/outputs/output-123.mp4
                 * We expose it via backend static route
                 */
                const fileName = data.output.split("outputs/")[1];
                setOutputVideo(`https://vidbackend-3.onrender.com/${fileName}`);
                setStatus("done");
              } catch (e: any) {
                setStatus("error");
                setError(e.message);
              }
            }}
          >
            🎞️ Render Final Video
          </button>
        </>
      )}

      {/* FINAL OUTPUT VIDEO */}
      {status === "done" && outputVideo && (
        <>
          <h3>✅ Final Output Video</h3>

          <video
            src={outputVideo}
            controls
            style={{ width: "100%", maxWidth: 800 }}
          />

          <p>
            <a href={outputVideo} download>
              ⬇️ Download video
            </a>
          </p>
        </>
      )}
    </main>
  );
}
