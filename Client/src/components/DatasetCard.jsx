import React from "react";
import SpotlightCard from "./Reactbits/SpotlightCard/SpotlightCard";

const DatasetCard = ({ dataset, onView, onManage }) => {
  const id = dataset._id || dataset.id;
  const fileName = dataset.fileName || "Untitled Dataset";
  const uploadedAt = dataset.createdAt
    ? new Date(dataset.createdAt).toLocaleString()
    : "—";
  const summaryCount = dataset.summary?.length || 0;
  const insightsCount = dataset.insights?.length || 0;

  return (
    <SpotlightCard className="text-white shadow-lg hover:shadow-xl transition">
      <h3 className="text-xl font-semibold mb-1">{fileName}</h3>
      <p className="text-sm text-gray-400">Uploaded: {uploadedAt}</p>

      <div className="flex items-center gap-3 text-sm text-gray-300 mt-3">
        <span>Summary: {summaryCount}</span>
        <span>•</span>
        <span>Insights: {insightsCount}</span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onView(id)}
          className="px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition"
        >
          View
        </button>
        <button
          onClick={() => onManage(id)}
          className="px-4 py-2 border border-gray-400 text-white font-medium rounded-full hover:bg-gray-800 transition"
        >
          Manage
        </button>
      </div>
    </SpotlightCard>
  );
};

export default DatasetCard;
