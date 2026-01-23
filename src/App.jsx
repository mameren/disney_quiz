import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { categories, difficulties, generateInitialQuestions } from './data/questions';

// --- Components ---

const MenuScreen = ({ onStart, allQuestionsCount }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedCount, setSelectedCount] = useState(10); // Default to 10

  const canStart = selectedGenre && selectedDifficulty && selectedCount;

  const countOptions = [5, 10, 20];

  return (
    <div className="glass-card">
      <h1 className="title">Disney Quiz Magic</h1>
      <p className="subtitle">ディズニーの魔法の世界へようこそ</p>
      <p style={{textAlign: 'center', opacity: 0.8, fontSize: '0.9rem'}}>現在 {allQuestionsCount} 問の問題が収録されています</p>

      <div className="selection-group">
        <label className="label">ジャンルを選択</label>
        <div className="grid-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`option-btn ${selectedGenre === cat.id ? 'selected' : ''}`}
              onClick={() => setSelectedGenre(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="selection-group">
        <label className="label">問題数を選択</label>
        <div className="grid-buttons">
          {countOptions.map((count) => (
            <button
              key={count}
              className={`option-btn ${selectedCount === count ? 'selected' : ''}`}
              onClick={() => setSelectedCount(count)}
            >
              {count}問
            </button>
          ))}
        </div>
      </div>

      <div className="selection-group">
        <label className="label">難易度を選択</label>
        <div className="grid-buttons">
          {difficulties.map((diff) => (
            <button
              key={diff}
              className={`option-btn ${selectedDifficulty === diff ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              LEVEL {diff}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="start-btn"
        disabled={!canStart}
        style={{ opacity: canStart ? 1 : 0.5, cursor: canStart ? 'pointer' : 'not-allowed' }}
        onClick={() => onStart(selectedGenre, selectedDifficulty, selectedCount)}
      >
        START QUIZ
      </button>
    </div>
  );
};

const QuizScreen = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (index) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    if (index === currentQuestion.correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFFFFF']
      });
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(score, questions.length);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="quiz-header">
        <span>Question {currentIndex + 1} / {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <h2 className="question-text">{currentQuestion.text}</h2>

      <div className="choices-grid">
        {currentQuestion.options.map((opt, idx) => {
          let className = 'choice-btn';
          if (selectedOption !== null) {
            if (idx === currentQuestion.correct) className += ' correct';
            else if (idx === selectedOption) className += ' incorrect';
          }
          
          return (
            <button
              key={idx}
              className={className}
              onClick={() => handleAnswer(idx)}
              disabled={selectedOption !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="feedback-area">
          <button className="next-btn" onClick={handleNext}>
            {isLast ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </div>
  );
};

const ResultScreen = ({ score, total, onRetry, unlockCount }) => {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }, []);

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <h2 className="title">Result</h2>
      <p className="subtitle">あなたのスコア</p>
      
      <div className="result-score">
        {score} / {total}
      </div>
      
      <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
        {percentage === 100 ? 'Perfect! 素晴らしい魔法の知識です！' : 
         percentage >= 80 ? 'Great! とても詳しいですね！' :
         'Good Try! もっとディズニーを知ろう！'}
      </p>

      <button className="start-btn" onClick={onRetry}>
        もう一度挑戦する
      </button>
      
      {unlockCount > 0 && (
         <div className="auto-add-badge">
           ✨ 新しい問題が{unlockCount}問追加されました！
         </div>
      )}
    </div>
  );
};

// --- Main App ---

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [allQuestions, setAllQuestions] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [lastScore, setLastScore] = useState({ score: 0, total: 0 });
  const [newlyAddedCount, setNewlyAddedCount] = useState(0);

  // Load questions on mount
  useEffect(() => {
    // Generate the full pool of 100+ questions
    const q = generateInitialQuestions();
    setAllQuestions(q);
  }, []);

  const startGame = (genre, difficulty, count) => {
    // Match difficulty. Note: The mock filler questions cycle diff 1-5.
    // Base questions have specific diffs.
    let filtered = allQuestions.filter(q => q.difficulty === difficulty);
    
    if (genre !== 'all') {
      filtered = filtered.filter(q => q.genre === genre);
    }
    
    // If we picked a specific genre that has fewer questions, we might run out.
    // For this demo, let's just pick from what we have.


    // If we don't have enough exact matches for the demo, we might fall back to filler
    if (filtered.length === 0) {
      alert("この条件に合う問題がまだありません。他の条件で試してください。");
      return;
    }

    // Shuffle and pick requested number for a session
    // If fewer available than requested, take all available
    const actualCount = Math.min(filtered.length, count);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, actualCount);
    
    setGameQuestions(shuffled);
    setGameState('playing');
  };

  const finishGame = (score, total) => {
    // Simulate "Auto Add" logic: Add 5 new random questions to the pool
    const newQuestions = [];
    const currentCount = allQuestions.length;
    
    // Create new mock questions on the fly
    for(let i=0; i<5; i++) {
        const newId = currentCount + i;
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const randomDiff = Math.floor(Math.random() * 5) + 1;
        
        newQuestions.push({
            id: `auto_${newId}`,
            genre: randomCat.id,
            difficulty: randomDiff,
            text: `[追加問題] ${randomCat.name}についての新しいクイズです #${newId + 1}`,
            options: ['正解', 'ダミーA', 'ダミーB', 'ダミーC'],
            correct: 0,
            isAutoGenerated: true
        });
    }

    setAllQuestions(prev => [...prev, ...newQuestions]);
    setNewlyAddedCount(newQuestions.length);
    setLastScore({ score, total });
    setGameState('result');
  };

  return (
    <div className="app-container">
      {gameState === 'menu' && <MenuScreen onStart={startGame} allQuestionsCount={allQuestions.length} />}
      {gameState === 'playing' && <QuizScreen questions={gameQuestions} onFinish={finishGame} />}
      {gameState === 'result' && (
        <ResultScreen 
          score={lastScore.score} 
          total={lastScore.total} 
          onRetry={() => setGameState('menu')}
          unlockCount={newlyAddedCount}
        />
      )}
    </div>
  );
}

export default App;
