import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ enables reading & sending cookies
app.use(
  cors({
    origin: "http://localhost:5173", // put your actual frontend URL for prod
    credentials: true, // ✅ enables sending cookies from frontend
  })
);

await connectDB(); // connect to database

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(3000, () => console.log("✅ Server running on port 3000"));
