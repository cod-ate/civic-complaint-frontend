import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6c2.2 0 4.1.7 5.7 1.7M21.5 12s-3.5 6-9.5 6c-2.2 0-4.1-.7-5.7-1.7M3 3l18 18"/><circle cx="12" cy="12" r="2.7"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
  );
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const result = await adminLogin(userId, password);
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminToken", result.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop" />
      <div className="auth-card">
        <button className="back-link" onClick={() => navigate("/")}><span>←</span> Back to portal</button>
        <div className="auth-icon"><ShieldIcon /></div>
        <p className="eyebrow">AUTHORIZED ACCESS</p>
        <h1>Admin Portal</h1>
        <p className="auth-subtitle">Sign in to review and manage community complaints.</p>

        {error && <div className="alert alert-error"><span>!</span>{error}</div>}

        <form onSubmit={submit} className="modern-form">
          <label htmlFor="admin-user">Admin User ID</label>
          <div className="input-wrap">
            <span className="field-icon">⌁</span>
            <input id="admin-user" value={userId} onChange={(e) => setUserId(e.target.value)} required autoComplete="username" placeholder="Enter your user ID" />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="input-wrap">
            <span className="field-icon">••</span>
            <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Enter your password" />
            <button type="button" className="eye-button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>
              <EyeIcon hidden={!showPassword} />
            </button>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : <>Sign in securely <span>→</span></>}
          </button>
        </form>

        <div className="security-note"><span>✓</span> Protected administrator access</div>
      </div>
    </div>
  );
}
