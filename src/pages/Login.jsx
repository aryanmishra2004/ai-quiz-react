import { useState } from "react";

function Login({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    if (name.trim().toLowerCase() === "admin") {
      setUser({ role: "admin", name });
    } else {
      setUser({ role: "student", name });
    }
  };

  return (
    <div className="login">
      <h1>🤖 AI Quiz Generator</h1>
      <h2>Login</h2>
      <input
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <br />
      <button onClick={handleLogin}>Login</button>

    </div>
  );
}

export default Login;
