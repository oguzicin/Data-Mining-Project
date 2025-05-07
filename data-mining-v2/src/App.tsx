import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthorIdentificationPage from "./pages/AuthorIdentificationPage";
import TextClassificationPage from "./pages/TextClassificationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/author-identification" element={<AuthorIdentificationPage />} />
        <Route path="/text-classification" element={<TextClassificationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
