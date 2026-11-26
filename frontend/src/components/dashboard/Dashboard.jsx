import React, { useEffect, useState } from "react";
import api from "../../config/api.js";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [allRepositories, setAllRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState("");
    const [issueCount, setIssueCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                // Fetch logged-in user's profile for real username
                const { data: userData } = await api.get(`/userProfile/${userId}`);
                setUsername(userData.username || "");
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }

            try {
                // Fetch user's own repositories
                const { data } = await api.get(`/repo/user/${userId}`);
                setRepositories(data?.repositories || []);
            } catch (err) {
                console.error("Failed to fetch user repos:", err);
                setRepositories([]);
            }

            try {
                // Fetch all public repositories for sidebar
                const { data } = await api.get("/repo/all");
                // /repo/all returns a flat array
                setAllRepositories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch all repos:", err);
                setAllRepositories([]);
            }

            try {
                // Fetch real issue count
                const { data } = await api.get("/issue/all");
                setIssueCount(Array.isArray(data) ? data.length : 0);
            } catch (err) {
                setIssueCount(0);
            }

            setLoading(false);
        };

        fetchAll();
    }, [userId]);

    const searchResults = searchQuery.trim() === ""
        ? allRepositories
        : allRepositories.filter((repo) =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">

                <div className="sidebar-search-wrapper">
                    <input
                        className="sidebar-search"
                        placeholder="Search repos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <span className="sidebar-section-label">Navigate</span>

                <a href="/" className="sidebar-nav-item active">
                    <span className="nav-icon">🏠</span>
                    Dashboard
                </a>

                <a href={`/userProfile/${userId}`} className="sidebar-nav-item">
                    <span className="nav-icon">👤</span>
                    My Profile
                </a>

                <span className="sidebar-section-label">All Repositories</span>

                {searchResults.length === 0 ? (
                    <div className="sidebar-empty">No repositories found</div>
                ) : (
                    searchResults.map((repo) => (
                        <a
                            key={repo._id}
                            href={`/repo/${repo._id}`}
                            className="sidebar-nav-item"
                        >
                            <span className="nav-icon">📁</span>
                            {repo.name}
                        </a>
                    ))
                )}
            </aside>

            {/* MAIN */}
            <main className="dashboard-main">

                {/* TOPBAR */}
                <div className="dashboard-topbar">
                    <div className="dashboard-greeting">
                        Welcome back 👋{username && <span> {username}</span>}
                    </div>
                    <div className="dashboard-date">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </div>
                </div>

                {/* STATS */}
                <div className="dashboard-stats">
                    <div className="stat-card stat-card--repos">
                        <div className="stat-card-label">Repositories</div>
                        <div className="stat-card-value">
                            {loading ? "—" : repositories.length}
                        </div>
                        <div className="stat-card-sub">your repos</div>
                    </div>

                    <div className="stat-card stat-card--issues">
                        <div className="stat-card-label">Issues</div>
                        <div className="stat-card-value">
                            {loading ? "—" : issueCount}
                        </div>
                        <div className="stat-card-sub">open issues</div>
                    </div>

                    <div className="stat-card stat-card--commits">
                        <div className="stat-card-label">Total Repos</div>
                        <div className="stat-card-value">
                            {loading ? "—" : allRepositories.length}
                        </div>
                        <div className="stat-card-sub">across platform</div>
                    </div>
                </div>

                {/* YOUR REPOS */}
                <div className="section-header">
                    <span className="section-title">Your Repositories</span>
                    <button
                        className="section-action"
                        onClick={() => navigate("/repo/create")}
                    >
                        + New repository
                    </button>
                </div>

                <div className="repo-grid">
                    {loading ? (
                        <div className="empty-state">
                            <div className="empty-state-text">Loading repositories...</div>
                        </div>
                    ) : repositories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📂</div>
                            <div className="empty-state-text">
                                No repositories yet. Create your first one.
                            </div>
                            <button
                                className="empty-state-btn"
                                onClick={() => navigate("/repo/create")}
                            >
                                Create repository
                            </button>
                        </div>
                    ) : (
                        repositories.map((repo) => (
                            <div
                                key={repo._id}
                                className="repo-card"
                                onClick={() => navigate(`/repo/${repo._id}`)}
                            >
                                <div className="repo-card-header">
                                    <span className="repo-card-name">{repo.name}</span>
                                    <span className="repo-card-visibility">
                                        {repo.visibility ? "public" : "private"}
                                    </span>
                                </div>

                                <p className="repo-card-description">
                                    {repo.description || "No description provided."}
                                </p>

                                <div className="repo-card-meta">
                                    <span className="repo-card-lang">
                                        <span className="lang-dot"></span>
                                        JavaScript
                                    </span>
                                </div>

                                <span className="repo-card-open">Open →</span>
                            </div>
                        ))
                    )}
                </div>

                {/* ACTIVITY — only shown when user has repos */}
                {!loading && repositories.length > 0 && (
                    <>
                        <div className="section-header">
                            <span className="section-title">Recent Activity</span>
                        </div>
                        <div className="activity-list">
                            {repositories.slice(0, 3).map((repo) => (
                                <div key={repo._id} className="activity-item">
                                    <div className="activity-icon">📁</div>
                                    <div className="activity-content">
                                        <div className="activity-text">
                                            Repository <strong>{repo.name}</strong> created
                                        </div>
                                        <div className="activity-time">
                                            {new Date(repo.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
