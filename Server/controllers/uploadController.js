import fs from "fs";
import csv from "csv-parser";
import { Dataset } from "../models/Dataset.js";
import { generateInsights } from "../utils/openai.js";

/**
 * Parse CSV file into an array of row objects
 */
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

/**
 * Analyze numeric columns and return summary stats
 */
function analyzeData(rows) {
  if (!rows || !rows.length) {
    throw new Error("CSV file is empty or invalid.");
  }

  const columns = Object.keys(rows[0]);
  const numericColumns = columns.filter((col) => {
    const val = parseFloat(rows[0][col]);
    return !isNaN(val) && isFinite(val);
  });

  if (!numericColumns.length) {
    throw new Error("No numeric columns found in the dataset.");
  }

  const summary = numericColumns.map((col) => {
    const values = rows.map((r) => parseFloat(r[col])).filter((v) => !isNaN(v));

    const avg =
      values.length > 0
        ? parseFloat(
            (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
          )
        : 0;

    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;

    return { column: col, avg, min, max };
  });

  return summary;
}

/**
 * Main controller: handle CSV upload, process, analyze, and store
 */
export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // 1️⃣ Parse CSV data
    const rows = await parseCSV(req.file.path);

    // 2️⃣ Generate statistical summary
    const summary = analyzeData(rows);

    // 3️⃣ Generate AI insights
    const insights = await generateInsights(summary);

    // 4️⃣ Save to MongoDB
    const dataset = await Dataset.create({
      userId: req.user?.id || null, // Safe access
      fileName: req.file.originalname,
      summary,
      insights,
    });

    // 5️⃣ Clean up temporary uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Temp file cleanup failed:", err);
    });

    // 6️⃣ Send final response
    res.status(200).json({
      message: "Dataset uploaded and processed successfully.",
      dataset,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({
      error: "Failed to process dataset.",
      details: error.message,
    });
  }
};
