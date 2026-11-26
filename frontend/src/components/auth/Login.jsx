import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../config/api.js";
import { useAuth } from "../../authContext.jsx";
import "./auth.css";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { currUser, setCurrUser } = useAuth();

    useEffect(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");

        setCurrUser(null);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/login", {
                email,
                password
            });

            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("token", res.data.token);

            setCurrUser(res.data.userId);
            setLoading(false);

            navigate("/");
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Invalid email or password. Please try again.");
            setPassword("");
            setEmail("");
        }
    };

    return (
        <div className="auth-container">
            {/* Left brand panel */}
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-monogram">&lt;/&gt;</div>
                    <span className="auth-brand-name">CodeVault</span>
                </div>
                <div className="auth-brand-headline">
                    <h1>Version control <span>reimagined</span></h1>
                    <p>Store, track, and collaborate on your code — all in one place.</p>
                </div>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <div className="auth-brand-feature-dot"></div>
                        Private repositories
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-brand-feature-dot"></div>
                        Team collaboration
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-brand-feature-dot"></div>
                        Issue tracking
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-box">
                    <div className="auth-form-header">
                        <h2>Sign in to CodeVault</h2>
                        <p>Welcome back — enter your credentials to continue.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="text"
                            placeholder="you@example.com"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button onClick={handleLogin} className="auth-submit-btn">
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="auth-divider">or</div>

                    <div className="auth-social-buttons">
                        <button className="auth-social-btn">
                            <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            GitHub
                        </button>
                        <button className="auth-social-btn">
                            <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.32a3.69 3.69 0 01-1.6 2.42v2.01h2.6c1.52-1.4 2.4-3.46 2.4-5.89z" fill="#4285F4"/>
                                <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H.86v2.07A8 8 0 008 16z" fill="#34A853"/>
                                <path d="M3.53 9.53A4.8 4.8 0 013.28 8c0-.53.09-1.04.25-1.53V4.4H.86A8 8 0 000 8c0 1.29.31 2.51.86 3.6l2.67-2.07z" fill="#FBBC05"/>
                                <path d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.28-2.28A8 8 0 008 0 8 8 0 00.86 4.4l2.67 2.07C4.16 4.58 5.92 3.18 8 3.18z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                    </div>

                    <div className="auth-switch">
                        New to CodeVault? <Link to="/signup">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
