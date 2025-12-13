import axios from "axios";

export default function CaptionControls({
  videoPath,
  onCaptions,
  onStyleChange,
  onStart,
  onError,
}) {
  const generate = async () => {
    try {
      onStart();
      const res = await axios.post(
        "http://localhost:5000/captions",
        { videoPath }
      );
      onCaptions(res.data.captions);
    } catch (err: any) {
      console.error(err);
      onError(
        err?.response?.data?.error ||
        err?.message ||
        "Caption generation failed"
      );
    }
  };

  return (
    <div>
      <button onClick={generate}>Auto-generate captions</button>

      <select onChange={(e) => onStyleChange(e.target.value)}>
        <option value="bottom">Bottom</option>
        <option value="top">Top</option>
        <option value="karaoke">Karaoke</option>
      </select>
    </div>
  );
}
