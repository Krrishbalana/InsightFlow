import mongoose from "mongoose";

// Define subdocument structure for summary and insights
const summarySchema = new mongoose.Schema(
  {
    column: { type: String, required: true },
    avg: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false } // no separate _id for each summary entry
);

const insightSchema = new mongoose.Schema(
  {
    insight: { type: String, required: true },
    impact: { type: String },
  },
  { _id: false }
);

// Main dataset schema
const datasetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    summary: {
      type: [summarySchema],
      default: [],
    },
    insights: {
      type: [insightSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Dataset = mongoose.model("Dataset", datasetSchema);
