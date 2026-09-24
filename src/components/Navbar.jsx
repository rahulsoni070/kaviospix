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
    <nav>
      <Link to="/albums">KaviosPix</Link>
      <div>
        <img
          src={user.avatar}
          alt={user.name}
          width="32"
          height="32"
          referrerPolicy="no-referrer"
        />
        <span>{user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}