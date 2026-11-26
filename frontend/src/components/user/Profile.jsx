import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api.js";
import "./profile.css";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [activeTab, setActiveTab] = useState("repos");

    const { userId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(
                    `/userProfile/${userId}`
                );
                console.log(data);
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRepos = async () => {
            try {
                const { data } = await api.get(
                    `/repo/user/${userId}`
                );
                setRepos(data?.repositories || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
        fetchRepos();
    }, [userId]);

    if (!user) return <div className="profile-layout">Loading...</div>;

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
                            <strong>{repos.length}</strong> repositories
                        </div>
                        <div className="profile-stat-pill">
                            <strong>0</strong> followers
                        </div>
                        <div className="profile-stat-pill">
                            <strong>0</strong> following
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

            {/* POPULAR REPOS */}
            <div className="profile-repo-grid">
                {repos.length === 0 ? (
                    <div style={{ color: "var(--color-text-subtle)", fontSize: "14px", padding: "20px 0" }}>
                        No repositories yet.
                    </div>
                ) : (
                    repos.slice(0, 6).map((repo) => (
                        <div key={repo._id} className="repo-card">
                            <div className="repo-card-header">
                                <span className="repo-card-name">{repo.name}</span>
                                <span className="repo-card-visibility">public</span>
                            </div>

                            <p className="repo-card-description">{repo.description || "No description"}</p>

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

            {/* CONTRIBUTIONS HEATMAP */}
            <div className="contribution-section">
                <div className="contribution-header">Contributions</div>
                <div className="contribution-card">
                    <HeatMapProfile />
                </div>
            </div>

        </div>
    );
};

export default Profile;
