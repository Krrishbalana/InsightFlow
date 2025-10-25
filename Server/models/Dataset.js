import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    filepath: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    UploadedAt: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: String,
      trim: true,
    },
    insights: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Dataset = mongoose.model("Dataset", userSchema);
