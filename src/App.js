import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import RedirectPage from "./pages/RedirectPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
         <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
