import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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
      <Header />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/auth"    element={<AuthPage />} />
        <Route path="/quiz"    element={<div className="page-center"><QuizPage /></div>} />
        <Route path="/roulette" element={<div className="page-center"><RoulettePage /></div>} />
        <Route path="/plan"    element={<div className="page-center"><PlanPage /></div>} />
        <Route path="/stats"   element={<div className="page-center"><StatsPage /></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
