import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api.js";
import "./repo.css";

const RepoDetail = () => {
    const { repoId } = useParams();
    const navigate = useNavigate();

    const [repo, setRepo] = useState(null);
    const [issues, setIssues] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Issue form
    const [issueTitle, setIssueTitle] = useState("");
    const [issueDesc, setIssueDesc] = useState("");
    const [issueLoading, setIssueLoading] = useState(false);
    const [issueError, setIssueError] = useState("");
    const [showIssueForm, setShowIssueForm] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const { data } = await api.get(`/repo/${repoId}`);
                setRepo(data);
            } catch (err) {
                setError("Repository not found.");
            }
        };

        const fetchIssues = async () => {
            try {
                const { data } = await api.get(`/issue/all?repoId=${repoId}`);
                setIssues(Array.isArray(data) ? data : []);
            } catch (err) {
                setIssues([]);
            }
        };

        const load = async () => {
            setLoading(true);
            await Promise.all([fetchRepo(), fetchIssues()]);
            setLoading(false);
        };

        load();
    }, [repoId]);

    const handleDeleteRepo = async () => {
        if (!window.confirm(`Delete "${repo.name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/repo/delete/${repoId}`);
            navigate("/");
        } catch (err) {
            alert("Failed to delete repository.");
        }
    };

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        if (!issueTitle.trim() || !issueDesc.trim()) {
            setIssueError("Title and description are required.");
            return;
        }
        try {
            setIssueLoading(true);
            setIssueError("");
            const { data } = await api.post("/issue/create", {
                title: issueTitle.trim(),
                description: issueDesc.trim(),
                repoId,
            });
            setIssues((prev) => [...prev, data]);
            setIssueTitle("");
            setIssueDesc("");
            setShowIssueForm(false);
        } catch (err) {
            setIssueError("Failed to create issue.");
        } finally {
            setIssueLoading(false);
        }
    };

    const handleCloseIssue = async (issueId) => {
        try {
            await api.put(`/issue/update/${issueId}`, { status: "closed" });
            setIssues((prev) =>
                prev.map((i) => (i._id === issueId ? { ...i, status: "closed" } : i))
            );
        } catch (err) {
            alert("Failed to update issue.");
        }
    };

    const handleDeleteIssue = async (issueId) => {
        if (!window.confirm("Delete this issue?")) return;
        try {
            await api.delete(`/issue/delete/${issueId}`);
            setIssues((prev) => prev.filter((i) => i._id !== issueId));
        } catch (err) {
            alert("Failed to delete issue.");
        }
    };

    const handleToggleVisibility = async () => {
        try {
            const { data } = await api.patch(`/repo/toggle/${repoId}`);
            setRepo(data.updatedRepository);
        } catch (err) {
            alert("Failed to toggle visibility.");
        }
    };

    if (loading) return <div className="repo-detail-page"><div className="repo-loading">Loading...</div></div>;
    if (error)   return <div className="repo-detail-page"><div className="repo-loading">{error}</div></div>;

    const isOwner = repo.owner?._id === userId || repo.owner === userId;
    const openIssues  = issues.filter((i) => i.status === "open");
    const closedIssues = issues.filter((i) => i.status === "closed");

    return (
        <div className="repo-detail-page">

            {/* HEADER */}
            <div className="repo-detail-header">
                <div className="repo-detail-breadcrumb">
                    <span
                        className="repo-detail-owner"
                        onClick={() => navigate(`/userProfile/${repo.owner?._id || repo.owner}`)}
                    >
                        {repo.owner?.username || "user"}
                    </span>
                    <span className="repo-detail-sep">/</span>
                    <span className="repo-detail-name">{repo.name}</span>
                    <span className={`repo-detail-badge ${repo.visibility ? "public" : "private"}`}>
                        {repo.visibility ? "Public" : "Private"}
                    </span>
                </div>

                {isOwner && (
                    <div className="repo-detail-actions">
                        <button className="repo-action-btn" onClick={handleToggleVisibility}>
                            {repo.visibility ? "🔒 Make Private" : "🌍 Make Public"}
                        </button>
                        <button className="repo-action-btn danger" onClick={handleDeleteRepo}>
                            🗑 Delete
                        </button>
                    </div>
                )}
            </div>

            {repo.description && (
                <p className="repo-detail-description">{repo.description}</p>
            )}

            {/* TABS */}
            <div className="repo-tabs">
                <button
                    className={`repo-tab ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                >
                    📄 Overview
                </button>
                <button
                    className={`repo-tab ${activeTab === "issues" ? "active" : ""}`}
                    onClick={() => setActiveTab("issues")}
                >
                    🐛 Issues
                    {openIssues.length > 0 && (
                        <span className="repo-tab-count">{openIssues.length}</span>
                    )}
                </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <div className="repo-overview">
                    <div className="repo-info-card">
                        <div className="repo-info-row">
                            <span className="repo-info-label">Repository</span>
                            <span className="repo-info-value">{repo.name}</span>
                        </div>
                        <div className="repo-info-row">
                            <span className="repo-info-label">Owner</span>
                            <span
                                className="repo-info-value link"
                                onClick={() => navigate(`/userProfile/${repo.owner?._id || repo.owner}`)}
                            >
                                {repo.owner?.username || "—"}
                            </span>
                        </div>
                        <div className="repo-info-row">
                            <span className="repo-info-label">Visibility</span>
                            <span className="repo-info-value">
                                {repo.visibility ? "🌍 Public" : "🔒 Private"}
                            </span>
                        </div>
                        <div className="repo-info-row">
                            <span className="repo-info-label">Open Issues</span>
                            <span className="repo-info-value">{openIssues.length}</span>
                        </div>
                    </div>

                    <div className="repo-cli-section">
                        <h3>Use with CodeVault CLI</h3>
                        <div className="repo-cli-block">
                            <code>node index.js init</code>
                            <code>node index.js add &lt;file&gt;</code>
                            <code>node index.js commit "your message"</code>
                            <code>node index.js push</code>
                        </div>
                    </div>
                </div>
            )}

            {/* ISSUES TAB */}
            {activeTab === "issues" && (
                <div className="repo-issues">

                    <div className="issues-header">
                        <div className="issues-filter">
                            <span className="issues-count">
                                <strong>{openIssues.length}</strong> open &nbsp;·&nbsp;
                                <strong>{closedIssues.length}</strong> closed
                            </span>
                        </div>
                        {isOwner && (
                            <button
                                className="new-issue-btn"
                                onClick={() => setShowIssueForm((v) => !v)}
                            >
                                {showIssueForm ? "✕ Cancel" : "+ New Issue"}
                            </button>
                        )}
                    </div>

                    {/* NEW ISSUE FORM */}
                    {showIssueForm && (
                        <form className="issue-form" onSubmit={handleCreateIssue}>
                            <h3>New Issue</h3>
                            {issueError && <div className="repo-error">{issueError}</div>}
                            <div className="repo-field">
                                <label>Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Short summary of the issue"
                                    value={issueTitle}
                                    onChange={(e) => setIssueTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="repo-field">
                                <label>Description <span className="required">*</span></label>
                                <textarea
                                    placeholder="Describe the issue in detail..."
                                    value={issueDesc}
                                    onChange={(e) => setIssueDesc(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="repo-create-actions">
                                <button
                                    type="button"
                                    className="repo-cancel-btn"
                                    onClick={() => setShowIssueForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="repo-submit-btn" disabled={issueLoading}>
                                    {issueLoading ? "Submitting..." : "Submit Issue"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ISSUES LIST */}
                    {issues.length === 0 ? (
                        <div className="issues-empty">
                            <div className="issues-empty-icon">🎉</div>
                            <div className="issues-empty-text">No issues yet. Everything looks good!</div>
                        </div>
                    ) : (
                        <div className="issues-list">
                            {issues.map((issue) => (
                                <div key={issue._id} className={`issue-item ${issue.status}`}>
                                    <div className="issue-status-dot" />
                                    <div className="issue-body">
                                        <div className="issue-title">{issue.title}</div>
                                        <div className="issue-desc">{issue.description}</div>
                                    </div>
                                    <div className="issue-meta">
                                        <span className={`issue-badge ${issue.status}`}>
                                            {issue.status}
                                        </span>
                                        {isOwner && issue.status === "open" && (
                                            <button
                                                className="issue-action-btn"
                                                onClick={() => handleCloseIssue(issue._id)}
                                            >
                                                Close
                                            </button>
                                        )}
                                        {isOwner && (
                                            <button
                                                className="issue-action-btn danger"
                                                onClick={() => handleDeleteIssue(issue._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RepoDetail;
