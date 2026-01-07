import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "SanthoshMobilesHub@2026" &&
      password === "SMH@2026"
    ) {
      onLogin(); // ✅ NOW THIS EXISTS
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
