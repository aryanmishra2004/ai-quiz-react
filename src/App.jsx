import { useState } from "react";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;
  if (user.role === "admin") return <Admin user={user} setUser={setUser} />;
  return <Quiz user={user} setUser={setUser} />;
}

export default App;
