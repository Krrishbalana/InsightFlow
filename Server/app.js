// Server/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import datasetRoutes from "./routes/datasetRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser()); // enables reading & sending cookies

// Use env var for allowed origin in production.
// During local dev this falls back to http://localhost:5173
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // enables sending cookies from frontend
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/datasets", datasetRoutes);

// Start server only after DB is connected
const start = async () => {
  try {
    await connectDB(); // connect to database
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ CORS allowed origin: ${CLIENT_ORIGIN}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
