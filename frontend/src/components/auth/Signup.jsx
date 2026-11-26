import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../config/api.js";
import { useAuth } from "../../authContext.jsx";
import "./auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setCurrUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/signup", {
        email: email,
        username: username,
        password: password
      });

      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("token", res.data.token);

      setCurrUser(res.data.userId);
      setLoading(false);

      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Signup failed. Username or email may already be taken.");
      setLoading(false);
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
            <h2>Create your account</h2>
            <p>Join CodeVault and start building today.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="yourhandle"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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

          <button onClick={handleSignup} className="auth-submit-btn">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
