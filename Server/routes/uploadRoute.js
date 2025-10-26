import express from "express";
import { upload } from "../middleware/multerMiddleware.js";
import { uploadDataset } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/fileupload", protect, upload.single("file"), uploadDataset);

export default router;
