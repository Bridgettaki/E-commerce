import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user?.name || user?.email}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
