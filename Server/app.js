// Server/app.js (improved)
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

// Optional security middlewares (uncomment to enable)
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";

const app = express();

// If your app runs behind Render / proxies, enable trust proxy
// This helps Express know the original protocol so secure cookies work.
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser()); // enables reading & sending cookies

// Normalize origin (remove trailing slash)
const normalizeOrigin = (u = "") => String(u).replace(/\/+$/, "");

// Allowed origin from env (or fallback to localhost for dev)
// IMPORTANT: set CLIENT_ORIGIN exactly (no trailing slash) in Render env
const CLIENT_ORIGIN = normalizeOrigin(
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
);

// Build robust CORS options
const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // Allow non-browser requests like curl or server-to-server (incomingOrigin === undefined/null)
    if (!incomingOrigin) return callback(null, true);

    const cleaned = normalizeOrigin(incomingOrigin);
    if (cleaned === CLIENT_ORIGIN) return callback(null, true);

    // otherwise reject
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
  ],
  preflightContinue: false,
};

// Use CORS
app.use(cors(corsOptions));

/* Optional security middlewares (recommended before production)
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit requests per windowMs
}));
*/

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
