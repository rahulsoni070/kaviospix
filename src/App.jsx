import { Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Albums from "./pages/Albums";
import AlbumPage from "./pages/AlbumPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
      </Route>

      <Route path="*" element={<p className="page">Page not found</p>} />
    </Routes>
  );
}