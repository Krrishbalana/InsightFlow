import React from "react";
import GooeyNav from "./Reactbits/GooeyNav/GooeyNav";

// Update with your preferred items and links
const items = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
];

const Navbar = () => (
  <div className="pt-4 flex items-center justify-between">
    <span className="text-white font-extrabold text-3xl tracking-wide ml-4">
      Insight Flow.
    </span>
    <div className="flex-1 flex justify-end">
      <GooeyNav items={items} />
    </div>
  </div>
);

export default Navbar;
