import { useState } from "react";
import { Eye, EyeOff, FlaskConical, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@labtrack.edu");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="brand-icon large"><FlaskConical size={27} /></div>
        <div>
          <strong>LabTrack</strong>
          <span>Science Laboratory</span>
        </div>
      </div>

      <div className="login-card">
        <div className="login-heading">
          <div className="login-logo"><FlaskConical size={28} /></div>
          <h1>Welcome back</h1>
          <p>Sign in to manage your laboratory inventory.</p>
        </div>

        {error && <div className="form-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Email address</span>
            <div className="input-icon-wrap">
              <Mail size={18} />
              <input
                className="input with-icon"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@labtrack.edu"
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="input-icon-wrap">
              <Lock size={18} />
              <input
                className="input with-icon password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="login-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="text-button">Forgot password?</button>
          </div>

          <button className="btn btn-primary btn-lg login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="demo-hint">
          Demo account: <strong>admin@labtrack.edu</strong> / <strong>admin123</strong>
        </div>
      </div>

      <p className="login-footer">© 2026 LabTrack · Science Laboratory Inventory System</p>
    </div>
  );
}