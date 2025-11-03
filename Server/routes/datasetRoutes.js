import express from "express";
import {
  getUserDatasets,
  getDatasetById, // add this
} from "../controllers/datasetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/datasets?userId=<id>
router.get("/", protect, getUserDatasets);

// ✅ Get single dataset by ID
router.get("/:id", protect, getDatasetById);

export default router;
