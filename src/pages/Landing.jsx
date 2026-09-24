import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "🗂️",
    title: "Albums",
    text: "Keep trips, college events and family photos in separate albums.",
  },
  {
    icon: "🏷️",
    title: "Tags & favorites",
    text: "Tag photos, star your best shots and find them in seconds.",
  },
  {
    icon: "🔗",
    title: "Share with friends",
    text: "Share an album with friends. They can view and comment, but not delete.",
  },
  {
    icon: "💬",
    title: "Comments",
    text: "Talk about each photo with the people you share it with.",
  },
];

const STEPS = [
  "Sign in with Google. No password needed.",
  "Create an album and upload your photos.",
  "Share it with friends and start commenting.",
];

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");

  if (loading) return <p className="page">Loading...</p>;

  if (user) return <Navigate to="/albums" replace />;

  const goToLogin = (message) => {
    navigate("/login", { state: { message } });
  };

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    goToLogin("Please sign in to create your album.");
  };

  return (
    <div className="landing">
      <header className="navbar">
        <Link to="/" className="logo">📷 KaviosPix</Link>
        <Link to="/login" className="btn-primary">Sign in</Link>
      </header>

      <section className="hero">
        <h1>Your photos, organized and shared.</h1>
        <p className="hero-sub">
          Create albums, tag and favorite your best shots, and share them with
          friends, all in one place.
        </p>

        <div className="hero-actions">
          <button className="btn-primary btn-lg" onClick={() => goToLogin()}>
            Get started for free
          </button>
        </div>

        <form className="try-form" onSubmit={handleCreateAlbum}>
          <input
            type="text"
            placeholder="Name your first album, e.g. Goa Trip 2024"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            + Create album
          </button>
        </form>
        <p className="muted try-note">You'll be asked to sign in first.</p>
      </section>

      <section className="features">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>

      <section className="steps">
        <h2>How it works</h2>
        <ol>
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <footer className="landing-footer">
        Built by Rahul Soni · React, Node.js, MongoDB, Cloudinary
      </footer>
    </div>
  );
}