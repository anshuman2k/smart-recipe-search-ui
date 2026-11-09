import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setBusy(true);
    const { error: err } = await resetPassword(email.trim());
    setBusy(false);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(
        "If an account exists for that email, we've sent a password reset link. Check your inbox."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <ChefHat size={32} style={{ color: "var(--accent)" }} />
        </div>
        <h2 style={{ textAlign: "center" }}>Reset your password</h2>
        <p className="auth-subtitle" style={{ textAlign: "center" }}>
          Enter your email and we'll send you a reset link
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={busy}
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          Remember your password?{" "}
          <Link to="/sign-in" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

