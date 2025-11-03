import React, { useState, useEffect, useRef } from "react";
import GooeyNav from "./Reactbits/GooeyNav/GooeyNav";

const items = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const containerRef = useRef(null);

  const handleDropdown = (item) => {
    if (item.label === "About Us") {
      setDropdown((prev) => (prev === "about" ? null : "about"));
    } else if (item.label === "Contact") {
      setDropdown((prev) => (prev === "contact" ? null : "contact"));
    } else {
      setDropdown(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pt-4 flex items-center justify-between relative"
    >
      <span className="text-white font-extrabold text-3xl tracking-wide ml-4">
        Insight Flow.
      </span>

      <div className="flex-1 flex justify-end relative">
        <GooeyNav items={items} onItemClick={handleDropdown} />

        {/* Dropdown for About Us */}
        {dropdown === "about" && (
          <div className="absolute top-full right-32 mt-2 bg-white text-black p-4 rounded shadow-lg z-50">
            <h3 className="font-bold mb-2">About This Project</h3>
            <p>
              InsightFlow is a lightweight data analysis platform built to
              transform raw CSV files into clear, actionable insights. It
              enables users to upload datasets, automatically summarize key
              metrics, and uncover patterns through AI-driven analysis — without
              needing complex tools or coding knowledge.
              <br />
              The platform focuses on simplicity, automation, and clarity.
              Behind the scenes, InsightFlow uses{" "}
              <span className="font-bold">Node.js, Express, MongoDB,</span> and
              <span className="font-bold">React</span> to manage data pipelines
              and provide fast, structured feedback. <br /> <br />
              <span className="font-bold">Core Features:</span> <br /> Seamless
              CSV upload and parsing <br /> Automated data summarization (avg,
              min, max per column) <br /> AI-powered pattern detection and
              insights <br /> AI-generated insights for quick interpretation{" "}
              <br /> Secure user management and storage via MongoDB <br />{" "}
              <br /> InsightFlow was designed with one goal:{" "}
              <span className="font-bold">
                turn data into understanding — instantly.
              </span>
            </p>
          </div>
        )}

        {/* Dropdown for Contact */}
        {dropdown === "contact" && (
          <div className="absolute top-full right-16 mt-2  bg-white text-black p-4 rounded shadow-lg z-50">
            <h3 className="font-bold mb-2">Contact Details</h3>
            <p>
              Have a question, feedback, or want to collaborate? We’d love to
              hear from you. <br /> <br /> Whether you’re exploring data-driven
              insights, looking to integrate AI analytics, or just testing out
              InsightFlow, our team is always open to discussion and improvement
              ideas. <br /> <br /> <span className="font-bold">Email:</span>{" "}
              <a className="text-blue-500" href="krrishbalana@gmail.com">
                krrishbalana@gmail.com
              </a>{" "}
              <br /> <span className="font-bold">LinkedIn:</span>{" "}
              <a className="text-blue-500" href="linkedin.com/in/krrish-balana">
                krrishbalana
              </a>
              <br />
              <br /> We typically respond within 24–48 hours. <br />
              Let us know how we can help you get the most out of your data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
