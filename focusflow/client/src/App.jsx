import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Insights from "./pages/Insights";
import Weather from "./pages/Weather";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
