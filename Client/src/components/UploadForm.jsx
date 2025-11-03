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
    if (!file) return setError("Please select a CSV file to upload.");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      // ✅ Correct API endpoint
      const res = await fetch("http://localhost:3000/api/upload/fileupload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      console.log("✅ File uploaded successfully:", data);

      // ✅ Add new dataset card instantly to Dashboard
      onUpload?.(data);

      // ✅ Close the form (returns to dashboard automatically)
      onClose();
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="bg-zinc-300/90 backdrop-blur-md w-full max-w-lg rounded-3xl p-10 shadow-2xl relative animate-fadeInUp border border-zinc-100/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:text-black hover:bg-zinc-300 text-xl font-extrabold transition border rounded-full w-8 h-8 flex items-center justify-center text-white bg-black"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Upload New Dataset
        </h2>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="block">
            <span className="text-gray-600 font-medium">Choose CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full mt-2 p-3 border border-gray-900 rounded-lg cursor-pointer hover:bg-zinc-200 transition"
            />
          </label>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          {/* Submit button (same glowing effect as dashboard) */}
          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden px-6 py-3 text-lg font-semibold text-white bg-black rounded-full 
             transition-all duration-500 hover:scale-105 active:scale-95 group disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? "Uploading..." : "Upload Dataset"}
            </span>

            {/* animated background light streak */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0 
               group-hover:opacity-100 blur-md transition-all duration-700"
            ></span>

            {/* border glow */}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UploadForm;
