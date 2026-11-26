import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../authContext.jsx";
import api from "../config/api.js";
import "./navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { setCurrUser } = useAuth();
    const [username, setUsername] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        api.get(`/userProfile/${userId}`)
            .then(({ data }) => setUsername(data.username || ""))
            .catch(() => {});
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        setCurrUser(null);
        navigate("/login");
    };

    const avatarInitial = username
        ? username.charAt(0).toUpperCase()
        : userId?.charAt(0).toUpperCase() || "U";

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

                {/* AVATAR + DROPDOWN */}
                <div className="navbar-avatar-wrapper" ref={dropdownRef}>
                    <div
                        className="navbar-avatar"
                        onClick={() => setDropdownOpen((v) => !v)}
                        title={username || "Profile"}
                    >
                        {avatarInitial}
                    </div>

                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <div className="navbar-dropdown-header">
                                <strong>{username || "User"}</strong>
                            </div>
                            <button
                                className="navbar-dropdown-item"
                                onClick={() => { setDropdownOpen(false); navigate(`/userProfile/${userId}`); }}
                            >
                                👤 My Profile
                            </button>
                            <button
                                className="navbar-dropdown-item"
                                onClick={() => { setDropdownOpen(false); navigate("/repo/create"); }}
                            >
                                📁 New Repository
                            </button>
                            <div className="navbar-dropdown-divider" />
                            <button
                                className="navbar-dropdown-item danger"
                                onClick={handleLogout}
                            >
                                🚪 Sign Out
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
