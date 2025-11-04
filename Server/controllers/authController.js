import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const normalizeOrigin = (u = "") => String(u).replace(/\/+$/, "");

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Decide cookie options based on CLIENT_ORIGIN + NODE_ENV
    const clientOrigin = normalizeOrigin(process.env.CLIENT_ORIGIN || "");
    const isLocalClient =
      clientOrigin.startsWith("http://localhost") ||
      clientOrigin.startsWith("http://127.0.0.1");

    const cookieOptions = {
      httpOnly: true,
      secure:
        !isLocalClient && process.env.NODE_ENV === "production" ? true : false,
      sameSite:
        !isLocalClient && process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    };

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Send response
    res.status(200).json({
      message: "User logged in successfully",
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
