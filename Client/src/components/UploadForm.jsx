import React, { useState } from "react";

const UploadForm = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file to upload");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      // API call
      const res = await fetch("http://localhost:3000/api/upload/fileupload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      onUpload?.(data); // notify parent (Dashboard) of new dataset
      onClose(); // close modal
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {/* Card container */}
      <div className="relative bg-zinc-900/90 border border-zinc-700 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,255,255,0.15)] w-full max-w-lg animate-fadeInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center border border-zinc-600 hover:bg-zinc-800 hover:scale-110 transition-all duration-300"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Upload New Dataset
        </h2>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="block">
            <span className="text-gray-300 font-medium">Choose CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full mt-3 p-3 border border-zinc-700 bg-zinc-800/60 rounded-xl text-white cursor-pointer transition hover:bg-zinc-800 focus:ring-2 focus:ring-cyan-400"
            />
          </label>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          {/* Upload Button (same style as Dashboard button) */}
          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden px-6 py-3 text-lg font-semibold text-white bg-black rounded-full 
              transition-all duration-500 hover:scale-105 active:scale-95 group disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? "Uploading..." : "Upload Dataset"}
            </span>

            {/* glowing animated layer */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0 
                group-hover:opacity-100 blur-md transition-all duration-700"
            ></span>

            {/* glow border */}
            <span
              className="absolute inset-0 border border-zinc-100 rounded-full group-hover:border-transparent 
                group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-500"
            ></span>
          </button>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
};

export default UploadForm;
