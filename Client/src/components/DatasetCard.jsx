import React from "react";
import SpotlightCard from "./Reactbits/SpotlightCard/SpotlightCard";

const DatasetCard = ({ dataset, onView, onDelete }) => {
  const id = dataset._id || dataset.id;
  const fileName = dataset.fileName || "Untitled Dataset";
  const uploadedAt = dataset.createdAt
    ? new Date(dataset.createdAt).toLocaleString()
    : "—";
  const summaryCount = dataset.summary?.length || 0;
  const insightsCount = dataset.insights?.length || 0;

  return (
    <SpotlightCard className="text-white shadow-lg hover:shadow-xl transition border border-zinc-700 bg-zinc-900/80 rounded-3xl p-6">
      <h3 className="text-xl font-semibold mb-1">{fileName}</h3>
      <p className="text-sm text-gray-400">Uploaded: {uploadedAt}</p>

      <div className="flex items-center gap-3 text-sm text-gray-300 mt-3">
        <span>Summary: {summaryCount}</span>
        <span>•</span>
        <span>Insights: {insightsCount}</span>
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        {/* View Button */}
        <button
          onClick={() => onView(id)}
          className="relative overflow-hidden px-5 py-2 text-sm font-semibold text-white bg-black rounded-full
           transition-all duration-500 hover:scale-105 active:scale-95 group"
        >
          <span className="relative z-10">View</span>
          <span
            className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0
             group-hover:opacity-100 blur-md transition-all duration-700"
          ></span>
          <span
            className="absolute inset-0 border border-zinc-100 rounded-full group-hover:border-transparent
             group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-500"
          ></span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(id)}
          className="relative overflow-hidden px-5 py-2 text-sm font-semibold text-red-500 border border-red-400 rounded-full
            hover:text-white hover:bg-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all duration-500 active:scale-95"
        >
          Delete
        </button>
      </div>
    </SpotlightCard>
  );
};

export default DatasetCard;
