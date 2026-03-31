import { useState } from "react";

const getAttempts = () =>
  JSON.parse(window.localStorage.getItem("ai-quiz-attempts") ?? "[]");

function Admin({ user, setUser }) {
  const [tab, setTab] = useState("students");
  const attempts = getAttempts();
  const totalStudents = attempts.length;
  const topicCounts = attempts.reduce((topics, attempt) => {
    topics[attempt.topic] = (topics[attempt.topic] ?? 0) + 1;
    return topics;
  }, {});
  const popularTopic =
    Object.entries(topicCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "No attempts yet";
  const averageScore =
    totalStudents === 0
      ? "0%"
      : `${Math.round(
          (attempts.reduce((sum, attempt) => {
            const [earned, total] = attempt.score.split("/").map(Number);
            return sum + earned / total;
          }, 0) /
            totalStudents) *
            100,
        )}%`;

  return (
    <div className="container">
      <div className="navbar">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <span className="welcome-text">Signed in as {user.name}</span>
        </div>
        <button className="logout" onClick={() => setUser(null)}>
          Logout
        </button>
      </div>

      <section className="hero-panel admin-hero">
        <div>
          <p className="eyebrow">Performance overview</p>
          <h1>Track quiz history and review recent student attempts.</h1>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-label">Saved attempts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{averageScore}</span>
            <span className="stat-label">Average score</span>
          </div>
        </div>
      </section>

      <div className="tabs">
        <button
          className={tab === "students" ? "tab active" : "tab"}
          onClick={() => setTab("students")}
        >
          Students
        </button>
        <button
          className={tab === "analytics" ? "tab active" : "tab"}
          onClick={() => setTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {tab === "students" && (
        <div className="card">
          <h3>Recent student results</h3>
          {attempts.length === 0 ? (
            <p className="empty-state">
              No attempts have been saved yet. Complete a quiz as a student to
              populate this table.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={`${attempt.name}-${attempt.createdAt}`}>
                    <td>{attempt.name}</td>
                    <td>{attempt.topic}</td>
                    <td>{attempt.score}</td>
                    <td>{new Date(attempt.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "analytics" && (
        <div className="card">
          <h3>Analytics</h3>
          <div className="analytics-grid">
            <div className="metric-tile">
              <span className="metric-label">Total attempts</span>
              <strong>{totalStudents}</strong>
            </div>
            <div className="metric-tile">
              <span className="metric-label">Most popular topic</span>
              <strong>{popularTopic}</strong>
            </div>
            <div className="metric-tile">
              <span className="metric-label">Average score</span>
              <strong>{averageScore}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
