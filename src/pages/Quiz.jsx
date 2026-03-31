import { useState } from "react";
import Question from "../components/Question";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const getRuntimeVariable = (key) => {
  const viteValue = import.meta.env[key];

  if (viteValue) {
    return viteValue;
  }

  if (typeof window !== "undefined") {
    return window.huggingface?.variables?.[key];
  }

  return undefined;
};

const QUIZ_API_URL = getRuntimeVariable("VITE_QUIZ_API_URL");
const GROQ_API_KEY = getRuntimeVariable("VITE_GROQ_API_KEY");

const normalizeQuizPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.questions)) return payload.questions;
  if (typeof payload !== "string") return [];

  const cleanText = payload
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanText);

  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.questions)) return parsed.questions;

  return [];
};

const createQuizPrompt = (topic, count) => `
Create exactly ${count} multiple-choice quiz questions about ${topic}.

Return valid JSON only.
Use this exact format:
[
  {
    "question": "Question text",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "answer": "A"
  }
]
`;

const fetchQuizFromBackend = async (topic, count) => {
  const res = await fetch(QUIZ_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, count }),
  });

  if (!res.ok) {
    throw new Error(`Backend request failed with status ${res.status}`);
  }

  const result = await res.json();
  return normalizeQuizPayload(result.result ?? result);
};

const fetchQuizFromGroq = async (topic, count) => {
  if (!GROQ_API_KEY) {
    throw new Error("Missing VITE_GROQ_API_KEY in .env.local");
  }

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You create clean quiz JSON. Return JSON only with no markdown fences.",
        },
        {
          role: "user",
          content: createQuizPrompt(topic, count),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Groq request failed with status ${res.status}: ${errorText}`,
    );
  }

  const result = await res.json();
  const content = result.choices?.[0]?.message?.content;
  return normalizeQuizPayload(content);
};

function Quiz({ user, setUser }) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = quiz.reduce((total, question, index) => {
    if (answers[index] === question.answer) {
      return total + 1;
    }

    return total;
  }, 0);

  const saveAttempt = (finalScore, totalQuestions) => {
    const existingAttempts = JSON.parse(
      window.localStorage.getItem("ai-quiz-attempts") ?? "[]",
    );

    existingAttempts.unshift({
      name: user.name,
      topic,
      score: `${finalScore}/${totalQuestions}`,
      totalQuestions,
      createdAt: new Date().toISOString(),
    });

    window.localStorage.setItem(
      "ai-quiz-attempts",
      JSON.stringify(existingAttempts.slice(0, 20)),
    );
  };

  const generateQuiz = async () => {
    const trimmedTopic = topic.trim();
    const parsedCount = Number.parseInt(count, 10);

    if (!trimmedTopic) {
      setError("Please enter a topic first.");
      return;
    }

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 10) {
      setError("Please choose between 1 and 10 questions.");
      return;
    }

    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setError("");
    setLoading(true);

    try {
      const parsedQuiz = QUIZ_API_URL
        ? await fetchQuizFromBackend(trimmedTopic, parsedCount)
        : await fetchQuizFromGroq(trimmedTopic, parsedCount);

      if (!parsedQuiz.length) {
        throw new Error("Quiz payload was empty");
      }

      setQuiz(parsedQuiz);
    } catch (requestError) {
      console.error("Error:", requestError);
      setError(
        requestError.message ||
          "We couldn't generate a quiz right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index, optionKey) => {
    setAnswers((current) => {
      if (current[index]) {
        return current;
      }

      return { ...current, [index]: optionKey };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    saveAttempt(score, quiz.length);
  };

  return (
    <div className="container">
      <div className="navbar">
        <div>
          <p className="eyebrow">Student workspace</p>
          <span className="welcome-text">Hello, {user.name}</span>
        </div>
        <button className="logout" onClick={() => setUser(null)}>
          Logout
        </button>
      </div>

      <section className="hero-panel">
        <div>
          <p className="eyebrow">AI-powered assessment</p>
          <h1>Build a quiz in seconds and review every answer instantly.</h1>
          <p className="hero-copy">
            Pick a topic, choose how many questions you want, and let the app
            generate a fresh practice round for you.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">{count}</span>
            <span className="stat-label">Question target</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{answeredCount}</span>
            <span className="stat-label">Answered so far</span>
          </div>
        </div>
      </section>

      <section className="controls card">
        <div className="field-group">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Try React, Python, DBMS, or Operating Systems"
          />
        </div>

        <div className="field-group count-field">
          <label htmlFor="count">Questions</label>
          <input
            id="count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        <button onClick={generateQuiz} disabled={loading}>
          {loading ? "Generating quiz..." : "Generate Quiz"}
        </button>
      </section>

      {error && <p className="error-text">{error}</p>}

      {quiz.length > 0 && (
        <>
          <section className="results-banner">
            <div>
              <p className="eyebrow">Live progress</p>
              <h2>
                {answeredCount}/{quiz.length} answered
              </h2>
            </div>
            <div className="results-actions">
              <span className="score-pill">
                Score: {score}/{quiz.length}
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitted || answeredCount !== quiz.length}
              >
                {submitted ? "Submitted" : "Submit Score"}
              </button>
            </div>
          </section>

          {quiz.map((question, index) => (
            <Question
              key={`${question.question}-${index}`}
              q={question}
              index={index}
              selected={answers[index]}
              onSelect={(optionKey) => handleAnswer(index, optionKey)}
              locked={Boolean(answers[index])}
            />
          ))}
        </>
      )}

      {submitted && (
        <section className="summary card">
          <p className="eyebrow">Round complete</p>
          <h2>
            You scored {score} out of {quiz.length}
          </h2>
          <p className="summary-copy">
            Your latest attempt has been saved locally for the admin dashboard.
          </p>
        </section>
      )}
    </div>
  );
}

export default Quiz;
