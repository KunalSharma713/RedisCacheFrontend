import React from "react";
import "./Sidebar.css";

const Sidebar = ({ onViewChange, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Product Manager</h3>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-button`}
          onClick={() => onViewChange("home")}
        >
          Home
        </button>
        <button
          className={`nav-button`}
          onClick={() => onViewChange("list")}
        >
          All Products
        </button>
        <button
          className={`nav-button`}
          onClick={() => onViewChange("add")}
        >
          Add Product
        </button>
        <button
          className="nav-button logout-button"
          onClick={onLogout}
          style={{ marginTop: "2rem", color: "#e53e3e" }}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
