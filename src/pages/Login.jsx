import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const message = location.state?.message;

  if (loading) return <p className="page">Loading...</p>;
  if (user) return <Navigate to="/albums" replace />;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>📷 KaviosPix</h1>
        <p className="muted">Your photos, your albums. Share them with friends.</p>

        {message && <p className="login-message">{message}</p>}

        <a href={`${SERVER}/auth/google`} className="google-btn">
          Sign in with Google
        </a>

        <Link to="/" className="login-back">← Back to home</Link>
      </div>
    </div>
  );
}