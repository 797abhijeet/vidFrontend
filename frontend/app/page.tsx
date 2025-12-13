"use client";

import { useState } from "react";
import VideoUploader from "../components/VideoUploader";
import CaptionControls from "../components/CaptionControls";
import Loader from "../components/Loader";
import { Player } from "@remotion/player";
import { CaptionedVideo } from "../components/remotion/CaptionedVideo";

const API="https://vidbackend-3.onrender.com";

type Status =
  | "idle"
  | "uploading"
  | "captioning"
  | "rendering"
  | "done"
  | "error";

export default function Home() {
  const [videoPath, setVideoPath] = useState("");
  const [captions, setCaptions] = useState<any[]>([]);
  const [style, setStyle] = useState<"top" | "bottom" | "karaoke">("bottom");
  const [output, setOutput] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("");

  const canRender =
    videoPath.length > 0 &&
    captions.length > 0 &&
    status !== "rendering";

  const renderVideo = async () => {
    if (!canRender) return;

    try {
      setStatus("rendering");
      setStatusText("Rendering final video...");

      const res = await fetch(`${API}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoPath,
          captions,
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Render failed");
      }

      setOutput(`${API}${data.outputUrl}`);
      setStatus("done");
      setStatusText("🎉 Video rendered successfully");
    } catch (err: any) {
      console.error("Render error:", err);
      setStatus("error");
      setStatusText(err?.message || "❌ Rendering failed");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        padding: 32,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          padding: 32,
          background: "#020617",
          borderRadius: 16,
          color: "white",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🎬 Remotion Captioning Platform
        </h1>

        {(status === "uploading" ||
          status === "captioning" ||
          status === "rendering") && (
            <Loader text={statusText} />
          )}

        {status === "error" && (
          <p style={{ color: "#f87171", textAlign: "center" }}>
            {statusText}
          </p>
        )}

        {status === "done" && (
          <p style={{ color: "#4ade80", textAlign: "center" }}>
            {statusText}
          </p>
        )}

        {/* STEP 1: UPLOAD */}
        <VideoUploader
          onStart={() => {
            setStatus("uploading");
            setStatusText("Uploading video...");
          }}
          onUpload={(path) => {
            setVideoPath(path); // full URL from backend
            setCaptions([]);
            setOutput("");
            setStatus("done");
            setStatusText("✅ Video uploaded");
          }}
          onError={() => {
            setStatus("error");
            setStatusText("❌ Upload failed");
          }}
        />

        {/* STEP 2: CAPTIONS */}
        {videoPath && (
          <CaptionControls
            videoPath={videoPath}
            onStart={() => {
              setStatus("captioning");
              setStatusText("Generating captions...");
            }}
            onCaptions={(c) => {
              setCaptions(c);
              setStatus("done");
              setStatusText("✅ Captions ready");
            }}
            onStyleChange={setStyle}
            onError={() => {
              setStatus("error");
              setStatusText("❌ Caption generation failed");
            }}
          />
        )}

        {/* 🎬 SINGLE REMOTION PREVIEW */}
        {videoPath && captions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                background: "black",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >

              <Player<typeof CaptionedVideo, { videoPath: string; captions: any[]; style: "top" | "bottom" | "karaoke" }>
                component={CaptionedVideo}
                durationInFrames={30 * 60}
                fps={30}
                compositionWidth={1280}
                compositionHeight={720}
                controls
                inputProps={{
                  videoPath,
                  captions,
                  style,
                }}
                style={{ width: "100%", height: "100%" }}
              />

            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={renderVideo}
                disabled={!canRender}
                style={{
                  padding: "12px 28px",
                  borderRadius: 999,
                  border: "none",
                  background: canRender ? "#2563eb" : "#334155",
                  color: "white",
                  cursor: canRender ? "pointer" : "not-allowed",
                }}
              >
                Render Final Video
              </button>
            </div>
          </div>
        )}

        {/* FINAL OUTPUT */}
        {output && (
          <p style={{ marginTop: 20, textAlign: "center" }}>
            <a
              href={output}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#60a5fa" }}
            >
              ⬇️ Download rendered video
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
