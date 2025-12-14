
import axios from "axios";


const API = "https://vidbackend-4.onrender.com";

export default function VideoUploader({ onUpload, onStart, onError }) {
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      onStart();
      const fd = new FormData();
      fd.append("video", file);

      const res = await axios.post(`${API}/upload`, fd);
      onUpload(res.data.videoPath);
    } catch (err) {
      console.error(err);
      onError();
    }
  };

  return <input type="file" accept="video/mp4" onChange={upload} />;
}
