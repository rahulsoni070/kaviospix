import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
        <Link to="/albums" className="logo">📷 KaviosPix</Link>

        <div className="nav-user">
        <img
            src={user.avatar}
            alt={user.name}
            width="32"
            height="32"
            referrerPolicy="no-referrer"
        />
        <span className="nav-name">{user.name}</span>
        <button onClick={handleLogout}>Logout</button>
        </div>
    </nav>
    )
}