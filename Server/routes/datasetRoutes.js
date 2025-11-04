import express from "express";
import {
  getUserDatasets,
  getDatasetById,
  deleteDatasetById,
} from "../controllers/datasetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/datasets?userId=<id>
router.get("/", protect, getUserDatasets);

// ✅ Get single dataset by ID
router.get("/:id", protect, getDatasetById);

// delete dataset by ID
router.delete("/:id", protect, deleteDatasetById);

export default router;
