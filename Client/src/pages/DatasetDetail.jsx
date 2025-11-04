import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SpotlightCard from "../components/Reactbits/SpotlightCard/SpotlightCard";

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use Vite env var (falls back to localhost:3000)
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/datasets/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          throw new Error(text || "Failed to fetch dataset");
        }
        const data = await res.json();
        setDataset(data);
      } catch (err) {
        console.error("Error fetching dataset details:", err);
        setError(err.message || "Failed to load dataset");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDataset();
  }, [id, API_BASE]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-xl">
        Loading dataset details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  if (!dataset)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Dataset not found
      </div>
    );

  const fileName =
    dataset.file?.originalname || dataset.fileName || dataset.name || "Dataset";
  const uploadedAt = dataset.createdAt
    ? new Date(dataset.createdAt).toLocaleString()
    : "Unknown";

  // summary may be array or string; normalize to array for rendering cards
  const summaries = Array.isArray(dataset.summary)
    ? dataset.summary
    : dataset.summary
    ? [
        {
          column: "Summary",
          avg: null,
          min: null,
          max: null,
          text: dataset.summary,
        },
      ]
    : [];

  const insights = Array.isArray(dataset.insights) ? dataset.insights : [];

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Navbar */}
      <div className="relative z-30 px-6 py-6">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="relative z-30 flex flex-col items-center justify-start px-10 pt-12 space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="self-start bg-zinc-800/80 px-6 py-2 rounded-full text-sm hover:bg-zinc-700 transition-all duration-300 shadow-md"
        >
          ← Back to Dashboard
        </button>

        {/* Dataset Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-md">
            {fileName}
          </h1>
          <p className="text-gray-400 mt-2">Uploaded on {uploadedAt}</p>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-6 text-zinc-100">Summary</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.length === 0 ? (
              <div className="text-gray-400 col-span-full">
                No summary available.
              </div>
            ) : (
              summaries.map((s, idx) => (
                <SpotlightCard
                  key={idx}
                  spotlightColor="rgba(0, 229, 255, 0.25)"
                  className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl transition-all hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                    {s.column ?? s.title ?? `Column ${idx + 1}`}
                  </h3>

                  {/* numeric stats if present */}
                  {typeof s.avg === "number" ||
                  typeof s.min === "number" ||
                  typeof s.max === "number" ? (
                    <>
                      <p className="text-gray-300">
                        <span className="font-bold text-zinc-100">Avg:</span>{" "}
                        {Number.isFinite(s.avg) ? s.avg.toFixed(2) : "—"}
                      </p>
                      <p className="text-gray-300">
                        <span className="font-bold text-zinc-100">Min:</span>{" "}
                        {s.min ?? "—"}
                      </p>
                      <p className="text-gray-300">
                        <span className="font-bold text-zinc-100">Max:</span>{" "}
                        {s.max ?? "—"}
                      </p>
                    </>
                  ) : (
                    // fallback text summary
                    <p className="text-gray-300">
                      {s.text ?? s.detail ?? "No numeric stats."}
                    </p>
                  )}
                </SpotlightCard>
              ))
            )}
          </div>
        </div>

        {/* Insights Section */}
        <div className="w-full max-w-5xl mt-10">
          <h2 className="text-3xl font-bold mb-6 text-zinc-100">Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.length === 0 ? (
              <div className="text-gray-400 col-span-full">
                No insights available.
              </div>
            ) : (
              insights.map((i, idx) => (
                <SpotlightCard
                  key={idx}
                  spotlightColor="rgba(255, 255, 255, 0.2)"
                  className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-6 rounded-3xl transition-all hover:scale-[1.02]"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    💡 {i.title ?? i.insight ?? `Insight ${idx + 1}`}
                  </h3>
                  <p className="text-gray-400">{i.detail ?? i.impact ?? "—"}</p>
                </SpotlightCard>
              ))
            )}
          </div>
        </div>

        {/* Footer / Back */}
        <div className="mt-16 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-3 rounded-full text-lg bg-white text-black font-semibold hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
