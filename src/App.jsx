import { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState([]);

  const generateQuiz = async () => {
    setQuiz([]);
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Generate ${count} MCQ questions on ${topic}.

Return ONLY valid JSON.
Do not include any text, explanation, or markdown.

Format:
[
  {
    "question": "string",
    "options": {
      "A": "string",
      "B": "string",
      "C": "string",
      "D": "string"
    },
    "answer": "A"
  }
]`
          }
        ]
      })
    });

    const data = await res.json();

    try {
      const text = data.choices[0].message.content;
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanText);
      setQuiz(parsed);
    } catch (e) {
      console.log("RAW:", data.choices[0].message.content);
      alert("AI response parse nahi hua ❌");
    }
  };

  return (
    <div className="container">
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

      <button onClick={generateQuiz}>Generate Quiz</button>

      {quiz.map((q, i) => (
        <Question key={i} q={q} index={i} />
      ))}
    </div>
  );
}

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
          <div
            key={key}
            className={className}
            onClick={() => setSelected(key)}
          >
            {key}. {value}
          </div>
        );
      })}

      {selected && <p>✅ Correct: {q.answer}</p>}
    </div>
  );
}

export default App;
