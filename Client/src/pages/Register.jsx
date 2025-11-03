// src/pages/Login.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        form
      );
      // Registration successful? Redirect or show message.
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex ">
      {/* Left background panel with logo, nav, welcome */}
      <div
        className="w-full min-h-screen flex flex-col justify-between px-12 py-10 bg-black absolute"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* This z-10 ensures content overlays the bg image */}
        <div className="z-10">
          {/* Logo + Navbar links (horizontal row, spaced apart) */}
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
            <div>
              <div className="flex items-center bg-gray-100 rounded-full px-3">
                <span className="text-gray-400 mr-2">
                  <i className="fas fa-user" />
                  {/* Use React Icons for true modern icons */}
                </span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full bg-transparent p-3 outline-none rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center bg-gray-100 rounded-full px-3">
                <span className="text-gray-400 mr-2">
                  <i className="fas fa-user" />
                  {/* Use React Icons for true modern icons */}
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email"
                  className="w-full bg-transparent p-3 outline-none rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center bg-gray-100 rounded-full px-3">
                <span className="text-gray-400 mr-2">
                  <i className="fas fa-lock" />
                </span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent p-3 outline-none rounded-full"
                />
                <span className="text-gray-400">
                  <i className="fas fa-eye" />
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2 gap-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-gray-400 hover:text-black">
                Forgot Password?
              </a>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              className="w-full bg-black text-white py-3 rounded-full font-semibold text-lg hover:bg-gray-900 transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="flex items-center my-4">
              <hr className="grow border-gray-300" />
              <span className="mx-2 text-gray-400">Or</span>
              <hr className="grow border-gray-300" />
            </div>
            <Link
              to="/"
              className="block text-center w-full bg-gray-200 text-black py-3 rounded-full font-semibold text-lg hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
