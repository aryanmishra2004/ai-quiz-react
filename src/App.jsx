import { useState } from "react";
import Background from "./components/Background";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Background />
      {!user && <Login setUser={setUser} />}
      {user?.role === "admin" && <Admin user={user} setUser={setUser} />}
      {user?.role === "student" && <Quiz user={user} setUser={setUser} />}
    </>
  );
}

export default App;
