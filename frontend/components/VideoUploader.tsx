import axios from "axios";

export default function VideoUploader({ onUpload }) {
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("video", file);

    try {
      const res = await axios.post(
        "https://vidbackend-3.onrender.com/upload",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ backend returns { path }
      onUpload(res.data.path);
    } catch (err) {
      alert("Video upload failed");
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleUpload} />
    </div>
  );
}
