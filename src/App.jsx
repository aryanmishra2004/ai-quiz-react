import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem("ai-quiz-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("ai-quiz-user", JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem("ai-quiz-user");
  }, [user]);

  if (!user) return <Login setUser={setUser} />;
  if (user.role === "admin") return <Admin user={user} setUser={setUser} />;
  return <Quiz user={user} setUser={setUser} />;
}

export default App;
