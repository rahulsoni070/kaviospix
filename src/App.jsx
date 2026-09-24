import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Albums from "./pages/Albums";
import ProtectedRoute from "./components/ProtectedRoute";
import AlbumPage from "./pages/AlbumPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/albums" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
      </Route>

      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  );
}