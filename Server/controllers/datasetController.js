import { Dataset } from "../models/Dataset.js";

export const getUserDatasets = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?._id; // from token/session or query

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch datasets belonging to the user
    const datasets = await Dataset.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(datasets);
  } catch (err) {
    console.error("Error fetching datasets:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get single dataset details by ID
export const getDatasetById = async (req, res) => {
  try {
    const { id } = req.params;

    // check for valid Mongo ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid dataset ID" });
    }

    const dataset = await Dataset.findById(id);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // optional security check
    if (req.user && dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(dataset);
  } catch (err) {
    console.error("Error fetching dataset details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteDatasetById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid dataset ID" });
    }

    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // security: only owner can delete
    if (req.user && dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If you stored the uploaded file on disk / cloud, delete it here.
    // e.g. if dataset has filePath: await fs.unlinkSync(dataset.filePath)
    // (Implement according to your upload implementation.)

    await Dataset.findByIdAndDelete(id);

    res.status(200).json({ message: "Dataset deleted", id });
  } catch (err) {
    console.error("Error deleting dataset:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
