// src/views/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ marginTop: "20px" }}>
      <Link to="/">Home</Link> | {" "}
      <Link to="/dogs">Dog Page</Link>
    </nav>
  );
};

export default Navbar;
