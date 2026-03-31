import { useState } from "react";

function Login({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    if (trimmedName.toLowerCase() === "admin") {
      setUser({ role: "admin", name: trimmedName });
    } else {
      setUser({ role: "student", name: trimmedName });
    }
  };

  return (
    <main className="login-shell">
      <section className="login login-card">
        <p className="eyebrow">Interview practice workspace</p>
        <h1>AI Quiz Generator</h1>
        <h2>Sign in with your name to start a new quiz session.</h2>
        <input
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Continue</button>
        <p className="hint"></p>
      </section>
    </main>
  );
}

export default Login;
