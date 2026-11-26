import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api.js";
import "./profile.css";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [activeTab, setActiveTab] = useState("repos");
    const [loading, setLoading] = useState(true);

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/userProfile/${userId}`);
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        const fetchRepos = async () => {
            try {
                const { data } = await api.get(`/repo/user/${userId}`);
                // Always returns { repositories: [...] } — empty array is fine
                setRepos(data?.repositories || []);
            } catch (err) {
                console.error("Failed to fetch repos:", err);
                setRepos([]);
            }
        };

        const fetchAll = async () => {
            setLoading(true);
            await Promise.all([fetchUser(), fetchRepos()]);
            setLoading(false);
        };

        fetchAll();
    }, [userId]);

    if (loading) {
        return (
            <div className="profile-layout">
                <div className="profile-loading">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-layout">
                <div className="profile-loading">User not found.</div>
            </div>
        );
    }

    return (
        <div className="profile-layout">

            {/* PROFILE HEADER */}
            <div className="profile-header">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar-ring"></div>
                    <div className="profile-avatar">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-name">{user.username}</div>
                    <div className="profile-username">{user.email}</div>

                    <div className="profile-stats-row">
                        <div className="profile-stat-pill">
                            <strong>{repos.length}</strong>&nbsp;repositories
                        </div>
                        <div className="profile-stat-pill">
                            <strong>{user.followedUsers?.length || 0}</strong>&nbsp;followers
                        </div>
                        <div className="profile-stat-pill">
                            <strong>{user.starRepos?.length || 0}</strong>&nbsp;stars
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="profile-tabs">
                <button
                    className={`profile-tab ${activeTab === "repos" ? "active" : ""}`}
                    onClick={() => setActiveTab("repos")}
                >
                    Repositories
                </button>
                <button
                    className={`profile-tab ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`profile-tab ${activeTab === "stars" ? "active" : ""}`}
                    onClick={() => setActiveTab("stars")}
                >
                    Stars
                </button>
            </div>

            {/* REPO TAB */}
            {activeTab === "repos" && (
                <div className="profile-repo-grid">
                    {repos.length === 0 ? (
                        <div className="profile-empty">
                            <div className="profile-empty-icon">📂</div>
                            <div className="profile-empty-text">No repositories yet.</div>
                        </div>
                    ) : (
                        repos.map((repo) => (
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
                                    {repo.description || "No description"}
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
            )}

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <div className="contribution-section">
                    <div className="contribution-header">Contributions</div>
                    <div className="contribution-card">
                        <HeatMapProfile />
                    </div>
                </div>
            )}

            {/* STARS TAB */}
            {activeTab === "stars" && (
                <div className="profile-empty">
                    <div className="profile-empty-icon">⭐</div>
                    <div className="profile-empty-text">No starred repositories yet.</div>
                </div>
            )}

        </div>
    );
};

export default Profile;
