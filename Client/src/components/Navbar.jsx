// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import GooeyNav from "./Reactbits/GooeyNav/GooeyNav";

const items = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * PortalDropdown - mounts children into document.body and positions it.
 * props:
 *  - visible: boolean
 *  - top: number (px)
 *  - right: number (px)
 *  - onClose: function
 *  - children: node
 */
const PortalDropdown = ({ visible, top = 0, right = 0, onClose, children }) => {
  const elRef = useRef(null);
  if (!elRef.current) elRef.current = document.createElement("div");

  useEffect(() => {
    const el = elRef.current;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  // close on ESC
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  const portalStyle = {
    position: "fixed",
    top: `${top}px`,
    right: `${right}px`,
    zIndex: 9999,
    maxWidth: "420px",
    background: "white",
    color: "black",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
  };

  return ReactDOM.createPortal(
    <div style={portalStyle}>{children}</div>,
    elRef.current
  );
};

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null); // 'about' | 'contact' | null
  const [dropdownPos, setDropdownPos] = useState({ top: 80, right: 256 }); // px
  const containerRef = useRef(null);
  const portalRef = useRef(null);

  const handleDropdown = (item) => {
    // toggle dropdown key
    const key =
      item.label === "About Us"
        ? "about"
        : item.label === "Contact"
        ? "contact"
        : null;
    setDropdown((prev) => (prev === key ? null : key));
  };

  // compute preferred top/right based on container position and which dropdown
  const computePosition = useCallback(
    (which) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const top = rect.bottom + 8 + window.scrollY; // a little below navbar
      // Map to the same offsets you used previously: right-32 (256px) and right-16 (128px)
      const right = which === "about" ? 256 : which === "contact" ? 128 : 160;
      setDropdownPos({ top, right });
    },
    [setDropdownPos]
  );

  // update position when dropdown state changes, or on resize/scroll
  useEffect(() => {
    if (!dropdown) return;
    computePosition(dropdown);

    const handleResize = () => computePosition(dropdown);
    const handleScroll = () => computePosition(dropdown);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdown, computePosition]);

  // click outside listener that also checks portal content
  useEffect(() => {
    const handleClickOutside = (event) => {
      const container = containerRef.current;
      const portalEl = document.querySelector('[data-portal-dropdown="true"]');
      if (container && container.contains(event.target)) {
        // click inside navbar container -> leave as is (GooeyNav item clicks handled separately)
        return;
      }
      if (portalEl && portalEl.contains(event.target)) {
        // click inside portal dropdown -> do nothing
        return;
      }
      // otherwise click outside -> close dropdown
      setDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

        {/* Portal-based About dropdown */}
        <PortalDropdown
          visible={dropdown === "about"}
          top={dropdownPos.top}
          right={dropdownPos.right}
          onClose={() => setDropdown(null)}
        >
          <div data-portal-dropdown="true">
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
              <span className="font-bold">
                Node.js, Express, MongoDB,
              </span> and <span className="font-bold">React</span> to manage
              data pipelines and provide fast, structured feedback.
              <br /> <br />
              <span className="font-bold">Core Features:</span> <br /> Seamless
              CSV upload and parsing <br /> Automated data summarization (avg,
              min, max per column) <br /> AI-powered pattern detection and
              insights <br /> AI-generated insights for quick interpretation{" "}
              <br /> Secure user management and storage via MongoDB <br />{" "}
              <br />
              InsightFlow was designed with one goal:{" "}
              <span className="font-bold">
                turn data into understanding — instantly.
              </span>
            </p>
          </div>
        </PortalDropdown>

        {/* Portal-based Contact dropdown */}
        <PortalDropdown
          visible={dropdown === "contact"}
          top={dropdownPos.top}
          right={dropdownPos.right}
          onClose={() => setDropdown(null)}
        >
          <div data-portal-dropdown="true">
            <h3 className="font-bold mb-2">Contact Details</h3>
            <p>
              Have a question, feedback, or want to collaborate? We’d love to
              hear from you. <br /> <br />
              <span className="font-bold">Email:</span>{" "}
              <a className="text-blue-500" href="mailto:krrishbalana@gmail.com">
                krrishbalana@gmail.com
              </a>
              <br />
              <span className="font-bold">LinkedIn:</span>{" "}
              <a
                className="text-blue-500"
                href="https://linkedin.com/in/krrish-balana"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/krrish-balana
              </a>
              <br />
              <br /> We typically respond within 24–48 hours.
            </p>
          </div>
        </PortalDropdown>
      </div>
    </div>
  );
};

export default Navbar;
