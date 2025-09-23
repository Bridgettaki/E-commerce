import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="bg-shape one" />
      <div className="bg-shape two" />

      <div className="laptop-frame">
        <div className="login-box">
          <h1>Hello</h1>
          <h2>Welcome back!</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

          {/* ✅ styled with .forgot-password */}
          <div className="forgot-password">
            <Link to="/register">Don&apos;t have an account? Sign up</Link>
          </div>

          {/* ✅ styled with .social-login */}
          <div className="social-login">
            <button disabled>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="G"
              />
              Google
            </button>
            <button disabled>
              <img
                src="https://www.svgrepo.com/show/349553/facebook.svg"
                alt="F"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
