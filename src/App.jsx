import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import RoulettePage from './pages/RoulettePage';
import PlanPage from './pages/PlanPage';
import AuthPage from './pages/AuthPage';
import StatsPage from './pages/StatsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/roulette" element={<RoulettePage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
