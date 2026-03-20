import { useState } from "react";

const mockStudents = [
  { name: "Aryan", topic: "Python", score: "4/5" },
  { name: "Rahul", topic: "React", score: "3/5" },
  { name: "Priya", topic: "JavaScript", score: "5/5" },
];

function Admin({ user, setUser }) {
  const [tab, setTab] = useState("students");

  return (
    <div className="container">
      <div className="navbar">
        <span>👑 Admin: {user.name}</span>
        <button className="logout" onClick={() => setUser(null)}>Logout</button>
      </div>

      <h1>🛠️ Admin Panel</h1>

      <div className="tabs">
        <button className={tab === "students" ? "tab active" : "tab"} onClick={() => setTab("students")}>
          👨‍🎓 Students
        </button>
        <button className={tab === "analytics" ? "tab active" : "tab"} onClick={() => setTab("analytics")}>
          📊 Analytics
        </button>
      </div>

      {tab === "students" && (
        <div className="card">
          <h3>Student Results</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Topic</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.topic}</td>
                  <td>{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "analytics" && (
        <div className="card">
          <h3>📊 Analytics</h3>
          <p>Total Students: {mockStudents.length}</p>
          <p>Most Popular Topic: Python</p>
          <p>Average Score: 4/5</p>
        </div>
      )}
    </div>
  );
}

export default Admin;
