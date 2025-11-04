import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import csv from "csv-parser";
import { Dataset } from "../models/Dataset.js";
import { generateInsights } from "../utils/openai.js";

/**
 * Parse CSV file into an array of row objects with a safety row limit.
 * Resolves with array of rows.
 */
function parseCSV(filePath, { maxRows = 50000 } = {}) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream
      .on("data", (data) => {
        rows.push(data);
        // safety: stop reading if too many rows
        if (rows.length >= maxRows) {
          stream.destroy(); // will trigger 'error' with a custom message or 'close'
        }
      })
      .on("end", () => resolve(rows))
      .on("close", () => {
        // If stream destroyed due to maxRows, resolve with current rows
        resolve(rows);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * Analyze numeric columns and return summary stats
 */
function analyzeData(rows) {
  if (!rows || !rows.length) {
    throw new Error("CSV file is empty or invalid.");
  }

  const columns = Object.keys(rows[0] || {});
  // detect numeric columns by sampling first N rows
  const numericColumns = columns.filter((col) => {
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const val = parseFloat(rows[i][col]);
      if (!isNaN(val) && isFinite(val)) return true;
    }
    return false;
  });

  if (!numericColumns.length) {
    throw new Error("No numeric columns found in the dataset.");
  }

  const summary = numericColumns.map((col) => {
    const values = rows
      .map((r) => parseFloat(r[col]))
      .filter((v) => !Number.isNaN(v) && Number.isFinite(v));

    const avg =
      values.length > 0
        ? parseFloat(
            (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
          )
        : null;

    const min = values.length ? Math.min(...values) : null;
    const max = values.length ? Math.max(...values) : null;

    return { column: col, avg, min, max };
  });

  return summary;
}

/**
 * Main controller: handle CSV upload, process, analyze, and store
 */
export const uploadDataset = async (req, res) => {
  // config
  const MAX_ROWS = 50000; // adjust as needed
  const ALLOWED_EXTS = [".csv"];
  const ALLOWED_MIMES = ["text/csv", "application/vnd.ms-excel", "text/plain"];

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const uploadedPath = req.file.path;
  const origName = req.file.originalname || "dataset.csv";
  const ext = path.extname(origName).toLowerCase();
  const mime = req.file.mimetype || "";

  // basic validation
  if (!ALLOWED_EXTS.includes(ext) || (mime && !ALLOWED_MIMES.includes(mime))) {
    // cleanup temp file
    try {
      await fsp.unlink(uploadedPath);
    } catch (e) {
      // ignore
    }
    return res.status(400).json({ message: "Only CSV files are allowed." });
  }

  try {
    // 1) Parse CSV safely (with row cap)
    const rows = await parseCSV(uploadedPath, { maxRows: MAX_ROWS });

    if (!rows || rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Uploaded CSV is empty or malformed." });
    }

    // 2) Generate statistical summary
    const summary = analyzeData(rows);

    // 3) Generate AI insights (if your util expects summary)
    let insights = [];
    try {
      insights = (await generateInsights(summary)) || [];
    } catch (aiErr) {
      console.warn(
        "AI insights generation failed (continuing without insights):",
        aiErr.message || aiErr
      );
      insights = [];
    }

    // 4) Persist dataset (note: if using S3, store s3Key instead and remove local file)
    const dataset = await Dataset.create({
      userId: req.user?.id || req.user?._id || null,
      fileName: origName,
      summary,
      insights,
      createdAt: new Date(),
    });

    // 5) Cleanup uploaded temp file (best-effort)
    try {
      await fsp.unlink(uploadedPath);
    } catch (cleanupErr) {
      console.warn(
        "Temp file cleanup failed:",
        cleanupErr.message || cleanupErr
      );
    }

    // 6) Respond with created dataset
    return res.status(201).json({
      message: "Dataset uploaded and processed successfully.",
      dataset,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    // ensure temp file is removed on error
    try {
      if (req.file && req.file.path) await fsp.unlink(req.file.path);
    } catch (cleanupErr) {
      // ignore
    }
    return res
      .status(500)
      .json({ message: "Failed to process dataset.", details: err.message });
  }
};
