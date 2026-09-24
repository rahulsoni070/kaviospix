import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    login(token)
      .then(() => navigate("/albums", { replace: true }))
      .catch(() => navigate("/login", { replace: true }));
  }, [searchParams, navigate, login]);

  return <p>Signing you in...</p>;
}