import { useState } from "react";

function Question({ q, index }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      <h3>Q{index + 1}. {q.question}</h3>
      {Object.entries(q.options).map(([key, value]) => {
        let className = "option";
        if (selected) {
          if (key === q.answer) className += " correct";
          else if (key === selected) className += " wrong";
        }
        return (
          <div key={key} className={className} onClick={() => setSelected(key)}>
            {key}. {value}
          </div>
        );
      })}
      {selected && <p>✅ Correct: {q.answer}</p>}
    </div>
  );
}

function Quiz({ user, setUser }) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!topic) return;
    setQuiz([]);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://aryxn20-ai-quiz-backend.hf.space/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: parseInt(count) })
      });
      const result = await res.json();
      const text = result.result;
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanText);
      setQuiz(parsed);
    } catch (e) {
      console.error("Error:", e);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <span>👋 Hello, {user.name}</span>
        <button className="logout" onClick={() => setUser(null)}>Logout</button>
      </div>

      <h1>🤖 AI Quiz Generator</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
      />
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button onClick={generateQuiz} disabled={loading}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {quiz.map((q, i) => <Question key={i} q={q} index={i} />)}
    </div>
  );
}

export default Quiz;
