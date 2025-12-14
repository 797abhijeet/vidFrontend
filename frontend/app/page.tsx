
"use client";

import { useState } from "react";
import VideoUploader from "../components/VideoUploader";
import CaptionControls from "../components/CaptionControls";
import Loader from "../components/Loader";
import { Player } from "@remotion/player";
import { CaptionedVideo } from "../remotion/CaptionedVideo";

const API = process.env.REACT_APP_API_URL;


type Status =
  | "idle"
  | "uploading"
  | "captioning"
  | "rendering"
  | "done"
  | "error";

export default function Home() {
  const [videoPath, setVideoPath] = useState<string>("");
  const [captions, setCaptions] = useState<any[]>([]);
  const [style, setStyle] = useState<"top" | "bottom" | "karaoke">("bottom");
  const [output, setOutput] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("");



  const canRender =
    typeof videoPath === "string" &&
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
      console.log("Rendered video URL:", `${API}${data.outputUrl}`);
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
        background: "radial-gradient(circle at top, #1e1b4b, #020617)",
        padding: 32,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          padding: 32,
          background: "rgba(2,6,23,0.85)",
          borderRadius: 18,
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 24,
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Captionify — Add Captions to Your Videos
        </h1>

        {(status === "uploading" ||
          status === "captioning" ||
          status === "rendering") && (
            <Loader text={statusText} />
          )}

        {status === "error" && (
          <p style={{ color: "#ef4444", textAlign: "center" }}>
            {statusText}
          </p>
        )}

        {status === "done" && (
          <p style={{ color: "#22c55e", textAlign: "center" }}>
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
            setVideoPath(path);
            setCaptions([]);
            setOutput("");
            setStatus("done");
            setStatusText("✅ Video uploaded");
          }}
          onError={() => {
            setStatus("error");
            setStatusText("❌Upload failed");
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

        {/* PREVIEW */}
        {videoPath && captions.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                background: "black",
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 24,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Player
                component={CaptionedVideo as any}
                durationInFrames={30 * 60}
                fps={30}
                compositionWidth={1280}
                compositionHeight={720}
                controls
                inputProps={{ videoPath, captions, style }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            
          </div>
        )}

       
      </div>
    </main>
  );
}

