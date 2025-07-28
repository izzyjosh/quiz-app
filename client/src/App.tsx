import React from "react";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/dashboard";
import Quiz from "./pages/quiz";
import Result from "./pages/result";

function App() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/result" element={<Result/>} />
    </Routes>
  );
}

export default App;
