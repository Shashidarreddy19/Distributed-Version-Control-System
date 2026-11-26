import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "U";
  const avatarInitial = userId.charAt(0).toUpperCase();

  return (
    <nav className="navbar">

      {/* BRAND */}
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo-mark">&lt;/&gt;</div>
        <span className="navbar-brand-name">CodeVault</span>
      </Link>

      {/* RIGHT */}
      <div className="navbar-right">

        <button
          className="navbar-new-repo-btn"
          onClick={() => navigate("/repo/create")}
        >
          + New Repo
        </button>

        <div
          className="navbar-avatar"
          onClick={() => navigate(`/userProfile/${localStorage.getItem("userId")}`)}
        >
          {avatarInitial}
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
