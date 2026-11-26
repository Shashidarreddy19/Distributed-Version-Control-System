import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api.js";
import "./repo.css";

const CreateRepo = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Repository name is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const { data } = await api.post("/repo/create", {
                repositoryName: name.trim(),
                description: description.trim(),
                visibility,
                owner: userId,
            });

            navigate(`/repo/${data.repositoryId}`);
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to create repository.";
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="repo-create-page">
            <div className="repo-create-card">

                <div className="repo-create-header">
                    <h1>Create a new repository</h1>
                    <p>A repository stores your project files and revision history.</p>
                </div>

                {error && <div className="repo-error">{error}</div>}

                <form onSubmit={handleCreate}>

                    <div className="repo-field">
                        <label htmlFor="repoName">Repository name <span className="required">*</span></label>
                        <input
                            id="repoName"
                            type="text"
                            placeholder="my-awesome-project"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <span className="repo-field-hint">Use lowercase letters, numbers, and hyphens.</span>
                    </div>

                    <div className="repo-field">
                        <label htmlFor="repoDesc">Description <span className="optional">(optional)</span></label>
                        <textarea
                            id="repoDesc"
                            placeholder="What's this repository about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="repo-field">
                        <label>Visibility</label>
                        <div className="repo-visibility-options">
                            <label className={`repo-visibility-option ${visibility ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={visibility === true}
                                    onChange={() => setVisibility(true)}
                                />
                                <div className="visibility-icon">🌍</div>
                                <div>
                                    <strong>Public</strong>
                                    <p>Anyone can see this repository.</p>
                                </div>
                            </label>

                            <label className={`repo-visibility-option ${!visibility ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={visibility === false}
                                    onChange={() => setVisibility(false)}
                                />
                                <div className="visibility-icon">🔒</div>
                                <div>
                                    <strong>Private</strong>
                                    <p>Only you can see this repository.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="repo-create-actions">
                        <button
                            type="button"
                            className="repo-cancel-btn"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="repo-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create repository"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateRepo;
