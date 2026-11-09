import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-page">
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

