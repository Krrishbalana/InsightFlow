import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use Vite env var (falls back to localhost:3000)
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // required for sending cookie
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("❌ Login error:", data);
        throw new Error(data.message || "Login failed");
      }

      console.log("✅ Logged in:", data);

      // store user info locally (optional)
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      // navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left background panel */}
      <div
        className="w-full min-h-screen flex flex-col justify-between px-12 py-10 bg-black absolute"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="z-10">
          <Navbar />
        </div>
        <h1 className="text-white font-light text-center absolute top-1/2 left-2/3 transform -translate-x-1/3 -translate-y-1/2 text-9xl mb-6 z-10">
          Welcome To AI World.
        </h1>
      </div>

      {/* Right login card */}
      <div className="relative mx-10 min-h-screen flex items-center justify-center bg-transparent px-10">
        <div className="bg-white w-full max-w-md p-10 rounded-4xl shadow-2xl ">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 justify-center text-center">
            Log in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 px-10">
            <div className="flex items-center bg-gray-100 rounded-full px-3">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent p-3 outline-none rounded-full"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-3">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent p-3 outline-none rounded-full"
              />
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="flex justify-between text-sm text-gray-400 mt-2 gap-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-gray-400 hover:text-black">
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full bg-black text-white py-3 rounded-full font-semibold text-lg hover:bg-gray-900 transition disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div className="flex items-center my-4">
              <hr className="grow border-gray-300" />
              <span className="mx-2 text-gray-400">Or</span>
              <hr className="grow border-gray-300" />
            </div>

            <Link
              to="/register"
              className="block text-center w-full bg-gray-200 text-black py-3 rounded-full font-semibold text-lg hover:bg-gray-300 transition"
            >
              Register New User
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
