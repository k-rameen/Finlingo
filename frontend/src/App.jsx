import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import BadgesPage from './pages/BadgesPage';
import GoalJar from './pages/GoalJar';


import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import Level5 from "./pages/Level5";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth */}
        <Route path="/" element={<Login />} />

        {/* main */}
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />

        {/* levels */}
        <Route path="/level/1" element={<Level1 />} />
        <Route path="/level/2" element={<Level2 />} />
        <Route path="/level/3" element={<Level3 />} />
        <Route path="/level/4" element={<Level4 />} />
        <Route path="/level/5" element={<Level5 />} />

        {/* badges */}
        <Route path="/badges" element={<BadgesPage />} />

        {/* goal jar */}
        <Route path="/goal-jar" element={<GoalJar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
