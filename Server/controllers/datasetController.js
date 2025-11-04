import mongoose from "mongoose";
import fs from "fs/promises"; // only if you delete local files
import { Dataset } from "../models/Dataset.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Get datasets for authenticated user (or via ?userId= if allowed).
 * Returns { data: [...], page, limit } shape.
 */
export const getUserDatasets = async (req, res) => {
  try {
    const authUserId = req.user?._id?.toString();
    const queryUserId = req.query.userId;
    // Prefer auth user id; fall back to query (useful for admin endpoints)
    const userId = authUserId || queryUserId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!isValidId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Pagination (optional)
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(50, parseInt(req.query.limit || "20", 10));
    const skip = (page - 1) * limit;

    const datasets = await Dataset.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Logging for easier debugging in dev
    console.log(
      `Fetched ${datasets.length} datasets for user ${userId} (page ${page})`
    );

    // Return wrapper shape (frontend now handles both shapes)
    return res.status(200).json({ data: datasets, page, limit });
  } catch (err) {
    console.error("Error fetching datasets:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * Get single dataset by ID
 * Response: { data: dataset }
 */
export const getDatasetById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid dataset ID" });
    }

    const dataset = await Dataset.findById(id).lean();
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // Enforce auth: only owner can view
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (dataset.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Send plain dataset directly (frontend expects this)
    return res.status(200).json(dataset);
  } catch (err) {
    console.error("❌ Error fetching dataset details:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

/**
 * Delete dataset by ID (only owner)
 * - also deletes local file if dataset.filePath exists (placeholder)
 */
export const deleteDatasetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isValidId(id)) {
      return res.status(400).json({ message: "Invalid dataset ID" });
    }

    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // owner check
    if (req.user && dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If you store files on local disk, delete them (update field name if different)
    if (dataset.filePath) {
      try {
        await fs.unlink(dataset.filePath);
        console.log("Deleted local file:", dataset.filePath);
      } catch (fsErr) {
        console.warn(
          "Failed to delete local file (may not exist):",
          fsErr.message
        );
      }
    }

    // If you store files in S3, delete from S3 here (not included)

    await Dataset.findByIdAndDelete(id);

    return res.status(200).json({ message: "Dataset deleted", id });
  } catch (err) {
    console.error("Error deleting dataset:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
