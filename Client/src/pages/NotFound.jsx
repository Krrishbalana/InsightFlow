import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      {/* Floating animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full animate-pulse z-0"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full animate-pulse z-0"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-[8rem] md:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_25px_rgba(0,255,255,0.6)] animate-pulse">
          404
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          The page you’re looking for doesn’t exist or might have been moved.
          Don’t worry — let’s get you back to safety.
        </p>

        {/* Fancy return button */}
        <button
          onClick={() => navigate("/")}
          className="relative overflow-hidden px-8 py-3 text-lg font-semibold text-white bg-black rounded-full 
          transition-all duration-500 hover:scale-105 active:scale-95 group"
        >
          <span className="relative z-10">Back to Dashboard</span>

          {/* animated glow on hover */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0 
            group-hover:opacity-100 blur-md transition-all duration-700"
          ></span>

          <span
            className="absolute inset-0 border border-zinc-100 rounded-full group-hover:border-transparent 
            group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-500"
          ></span>
        </button>
      </div>

      {/* Small footer text */}
      <div className="absolute bottom-6 text-zinc-500 text-sm z-10">
        © {new Date().getFullYear()} InsightFlow — All rights reserved
      </div>
    </div>
  );
};

export default NotFound;
