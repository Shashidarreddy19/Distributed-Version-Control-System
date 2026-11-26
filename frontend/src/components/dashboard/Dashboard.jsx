import React, { useEffect, useState } from "react";
import api from "../../config/api.js";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();
    const username = localStorage.getItem("userId") || "Developer";

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const { data } = await api.get(
                    `/repo/user/${userId}`
                );
                setRepositories(data?.repositories || []);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const { data } = await api.get(
                    "/repo/all"
                );
                setSuggestedRepositories(data || []);
                setSearchResults(data?.repositories || []);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResults(suggestedRepositories);
        } else {
            const filtered = suggestedRepositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [searchQuery, suggestedRepositories]);

    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">

                <span className="sidebar-section-label">Explore</span>

                <a
                    href="/"
                    className="sidebar-nav-item active"
                >
                    <span className="nav-icon">🏠</span>
                    Dashboard
                </a>

                <a
                    href={`/userProfile/${localStorage.getItem("userId")}`}
                    className="sidebar-nav-item"
                >
                    <span className="nav-icon">👤</span>
                    My Profile
                </a>

                <span className="sidebar-section-label">Repositories</span>

                {searchResults.length === 0 ? (
                    <div style={{ padding: "8px 20px", fontSize: "13px", color: "var(--color-text-subtle)" }}>
                        No repositories
                    </div>
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
                        Welcome back 👋 <span>{username}</span>
                    </div>
                    <div className="dashboard-date">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>
                </div>

                {/* STATS */}
                <div className="dashboard-stats">
                    <div className="stat-card stat-card--repos">
                        <div className="stat-card-label">Repositories</div>
                        <div className="stat-card-value">{repositories.length}</div>
                        <div className="stat-card-sub">total repos</div>
                    </div>

                    <div className="stat-card stat-card--issues">
                        <div className="stat-card-label">Issues</div>
                        <div className="stat-card-value">5</div>
                        <div className="stat-card-sub">open issues</div>
                    </div>

                    <div className="stat-card stat-card--commits">
                        <div className="stat-card-label">Commits</div>
                        <div className="stat-card-value">128</div>
                        <div className="stat-card-sub">total commits</div>
                    </div>
                </div>

                {/* YOUR REPOS */}
                <div className="section-header">
                    <span className="section-title">Your Repositories</span>
                    <a href="/repo/create" className="section-action">+ New repository</a>
                </div>

                <div className="repo-grid">
                    {repositories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📂</div>
                            <div className="empty-state-text">No repositories yet. Create your first one.</div>
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
                                    <span className="repo-card-visibility">public</span>
                                </div>

                                <p className="repo-card-description">{repo.description || "No description provided."}</p>

                                <div className="repo-card-meta">
                                    <span className="repo-card-lang">
                                        <span className="lang-dot"></span>
                                        JavaScript
                                    </span>
                                    <span>⭐ 0</span>
                                </div>

                                <span className="repo-card-open">Open →</span>
                            </div>
                        ))
                    )}
                </div>

                {/* ACTIVITY */}
                <div className="section-header">
                    <span className="section-title">Recent Activity</span>
                </div>

                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">🔥</div>
                        <div className="activity-content">
                            <div className="activity-text"><strong>Pushed</strong> to a repository</div>
                            <div className="activity-time">just now</div>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">🐛</div>
                        <div className="activity-content">
                            <div className="activity-text"><strong>Opened</strong> an issue</div>
                            <div className="activity-time">2 hours ago</div>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">✅</div>
                        <div className="activity-content">
                            <div className="activity-text"><strong>Closed</strong> an issue</div>
                            <div className="activity-time">yesterday</div>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
};

export default Dashboard;
