import express from "express";

import { registerUser, loginUser } from "../controllers/user.controller.js"; // ✅ add .js
import { logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;
