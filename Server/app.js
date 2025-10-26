import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ enables reading & sending cookies

await connectDB(); // make sure MongoDB is connected

app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.listen(3000, () => console.log("✅ Server running on port 3000"));
