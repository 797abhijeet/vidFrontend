import axios from "axios";

type CaptionControlsProps = {
  videoPath: string; // 👈 REQUIRED
  onCaptions: (caps: any[]) => void;
  onStyleChange: (style: string) => void;
  onStart: () => void;
  onError: (err: string) => void;
};

export default function CaptionControls({
  videoPath,
  onCaptions,
  onStyleChange,
  onStart,
  onError,
}: CaptionControlsProps) {
  const generate = async () => {
    try {
      onStart(); // 🔥 tell UI we started

      const res = await axios.post(
        "http://localhost:5000/captions",
        {
          videoPath, // ✅ SEND VIDEO PATH
        }
      );

      // ✅ HANDLE RESPONSE HERE
      onCaptions(res.data.captions);
    } catch (err: any) {
      onError(
        err?.response?.data?.error ||
          "Failed to generate captions"
      );
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={generate}>
        Auto-generate captions
      </button>

      <select
        style={{ marginLeft: 10 }}
        onChange={(e) => onStyleChange(e.target.value)}
      >
        <option value="bottom">Bottom</option>
        <option value="top">Top</option>
      </select>
    </div>
  );
}
