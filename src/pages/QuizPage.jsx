import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { categories, difficulties, generateInitialQuestions } from '../data/questions';
import { facilities } from '../data/facilities';
import { fetchQuestions, saveScore, getLeaderboard, uploadQuestionsToFirestore, uploadFacilitiesToFirestore, saveQuizHistory } from '../services/quizService';
import { usePeer } from '../hooks/usePeer';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';
import TypewriterQuestion from '../components/TypewriterQuestion';

// ─── ルーム番号シェアボタン ───────────────────────────────────────────────────

const ShareRoomButtons = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const message = `【Disney Quiz オンライン対戦】\n友達と一緒にディズニークイズで対戦しよう！\nルーム番号: ${roomId}\nhttps://disney-quiz.vercel.app/quiz`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`ルーム番号: ${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Disney Quiz 対戦ルーム', text: message });
    }
  };

  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

  return (
    <div style={{ marginTop: '10px' }}>
      <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0 0 8px' }}>友達にシェア</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* コピー */}
        <button
          onClick={handleCopy}
          style={shareBtn('#4ade80')}
        >
          {copied ? '✅ コピー済み' : '📋 番号をコピー'}
        </button>

        {/* LINE */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...shareBtn('#06C755'), textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" fill="white" style={{ marginRight: '5px' }}>
            <path d="M24 4C12.95 4 4 11.86 4 21.5c0 5.32 2.8 10.06 7.17 13.23-.3 1.12-1.95 7.27-2.05 7.77 0 0-.03.26.14.36s.37.04.37.04c.49-.07 5.66-3.72 6.5-4.3A23.4 23.4 0 0024 39c11.05 0 20-7.86 20-17.5S35.05 4 24 4zm-6 21H13v-9h2v7h3v2zm3 0h-2v-9h2v9zm8 0h-2l-4-6v6h-2v-9h2l4 6v-6h2v9zm5-7h-3v2h3v2h-3v2h3v2h-5v-9h5v1z"/>
          </svg>
          LINE
        </a>

        {/* X (Twitter) */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...shareBtn('#000'), textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginRight: '5px' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X
        </a>

        {/* ネイティブシェア（モバイル対応） */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={handleNativeShare} style={shareBtn('#60a5fa')}>
            🔗 その他
          </button>
        )}
      </div>
    </div>
  );
};

const shareBtn = (bg) => ({
  padding: '7px 14px',
  borderRadius: '20px',
  border: 'none',
  background: bg,
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

// ─── みんはや Character Input ─────────────────────────────────────────────────

const MINNAYA_FILLERS = [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ東西南北山川海空火'];

const MinnayaInput = ({ question, onSubmit, onCharPick, disabled }) => {
  const answer = question.options[question.correct];
  const answerChars = React.useMemo(() => [...answer], [answer]);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
  const [picked, setPicked] = React.useState([]);

  // 4 options for current position: 1 correct + 3 random fillers, re-shuffled each time
  const currentOptions = React.useMemo(() => {
    if (currentCharIndex >= answerChars.length) return [];
    const correct = answerChars[currentCharIndex];
    const fillers = MINNAYA_FILLERS
      .filter(c => c !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...fillers].sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCharIndex, question.id]);

  React.useEffect(() => {
    setCurrentCharIndex(0);
    setPicked([]);
  }, [question.id]);

  const pickOption = (char) => {
    if (disabled) return;
    onCharPick?.();
    if (char === answerChars[currentCharIndex]) {
      const newPicked = [...picked, char];
      setPicked(newPicked);
      if (newPicked.length === answerChars.length) {
        onSubmit(true);
      } else {
        setCurrentCharIndex(i => i + 1);
      }
    } else {
      onSubmit(false);
    }
  };

  return (
    <div className="minnaya-container">
      <div className="minnaya-slots">
        {answerChars.map((_, i) => (
          <span key={i} className={
            `minnaya-slot${i < picked.length ? ' filled' : i === currentCharIndex ? ' active' : ''}`
          }>
            {i < picked.length ? picked[i] : i === currentCharIndex ? '？' : ''}
          </span>
        ))}
      </div>
      <p className="minnaya-hint">{currentCharIndex + 1}文字目を選んでください</p>
      <div className="minnaya-options">
        {currentOptions.map((char, i) => (
          <button
            key={i}
            className="minnaya-option-btn"
            onClick={() => pickOption(char)}
            disabled={disabled}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Components ---

const OnlineMenu = ({ peerId, onConnect, isConnected, onStartOnlineGame, isHost, connectionCount, isConnecting, connectionError, onBack }) => {
  const [remoteId, setRemoteId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedCount, setSelectedCount] = useState(10);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);

  const nameInput = (
    <div style={{marginBottom: '12px'}}>
      <label className="label">表示名</label>
      <input
        type="text"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
        placeholder="あなたの名前"
        maxLength={12}
        className="quiz-input"
        style={{width: '100%', boxSizing: 'border-box'}}
      />
    </div>
  );

  return (
    <div className="glass-card" style={{animation: 'popIn 0.3s ease'}}>
      <div style={{textAlign: 'left', marginBottom: '10px'}}>
        <button onClick={onBack} style={{background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer'}}>← Back</button>
      </div>
      <h2 className="title">オンライン対戦ルーム</h2>

      {!isConnected && connectionCount === 0 ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
           {/* CREATE ROOM */}
           <div className="room-section" style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px'}}>
              <h3 style={{marginTop: 0, color: '#4ade80'}}>🚪 部屋を作る (ホスト)</h3>
              {nameInput}
              <p style={{fontSize: '0.9rem', opacity: 0.8}}>この番号を友達に教えてください</p>
              <div style={{fontSize: '2rem', fontWeight: 'bold', userSelect: 'all', letterSpacing: '4px', margin: '10px 0', color: '#fff'}}>
                  {peerId || '...'}
              </div>
              {peerId && <ShareRoomButtons roomId={peerId} />}
              <p style={{fontSize: '0.8rem', marginTop: '10px'}}>参加者を待っています... (現在: 0人)</p>
           </div>

           {/* JOIN ROOM */}
           <div className="room-section" style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px'}}>
              <h3 style={{marginTop: 0, color: '#60a5fa'}}>🏃 部屋に入る (ゲスト)</h3>
              <p style={{fontSize: '0.9rem', opacity: 0.8}}>教えてもらった番号を入力してください</p>

              {connectionError && (
                  <div style={{color: '#ff4b2b', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '10px', fontSize: '0.9rem'}}>
                      ⚠️ {connectionError}
                  </div>
              )}

              <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px'}}>
                 <input
                   type="text"
                   value={remoteId}
                   onChange={(e) => setRemoteId(e.target.value)}
                   placeholder="123456"
                   maxLength={6}
                   className="quiz-input"
                 />
                 <button
                   className="start-btn"
                   onClick={() => onConnect(remoteId, playerName)}
                   disabled={!remoteId || remoteId.length < 6 || isConnecting}
                   style={{margin: 0, padding: '0 20px', fontSize: '1rem', height: 'auto', opacity: isConnecting ? 0.7 : 1}}
                 >
                   {isConnecting ? '接続中...' : '入室'}
                 </button>
              </div>
           </div>
        </div>
      ) : (
        <div style={{textAlign: 'center'}}>
           <p style={{fontSize: '1.5rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '10px'}}>
             ✅ {isHost ? `参加者: ${connectionCount}人` : 'ルームに接続完了！'}
           </p>
           {isHost ? (
             <div className="selection-group">
                {/* 接続後もルーム番号を表示 */}
                <div style={{background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '10px 20px', borderRadius: '10px', marginBottom: '15px'}}>
                  <p style={{margin: '0 0 4px', fontSize: '0.8rem', opacity: 0.8}}>ルーム番号（追加参加者に共有）</p>
                  <div style={{fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '4px', color: '#fff', userSelect: 'all'}}>{peerId}</div>
                  {peerId && <ShareRoomButtons roomId={peerId} />}
                </div>
                <p>全員集まったら設定して開始してください。</p>

                {nameInput}

                <div style={{margin: '10px 0', textAlign: 'left'}}>
                    <label className="label">ジャンルを選択</label>
                    <div className="grid-buttons">
                        {categories.map(cat => (
                            <button key={cat.id} className={`option-btn ${selectedGenre === cat.id ? 'selected' : ''}`} onClick={() => setSelectedGenre(cat.id)}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{margin: '10px 0', textAlign: 'left'}}>
                    <label className="label">難易度を選択: <strong style={{color: '#4ade80'}}>LEVEL {selectedDifficulty}</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={selectedDifficulty}
                        onChange={e => setSelectedDifficulty(Number(e.target.value))}
                        style={{width: '100%', accentColor: '#4ade80', marginTop: '8px'}}
                    />
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6}}>
                        <span>1</span><span>3</span><span>5</span>
                    </div>
                </div>

                <div style={{margin: '10px 0', textAlign: 'left'}}>
                    <label className="label">問題数を選択: <strong style={{color: '#4ade80'}}>{selectedCount}問</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={selectedCount}
                        onChange={e => setSelectedCount(Number(e.target.value))}
                        style={{width: '100%', accentColor: '#4ade80', marginTop: '8px'}}
                    />
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6}}>
                        <span>1</span><span>50</span><span>100</span>
                    </div>
                </div>

                <button className="start-btn" onClick={() => onStartOnlineGame(selectedCount, selectedGenre, selectedDifficulty, playerName)}>
                  全員でゲームを開始する
                </button>
             </div>
           ) : (
             <div>
               {nameInput}
               <p>ホストが開始するのを待っています...</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const LibraryScreen = ({ questions, onBack, onAddQuestion }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newQ, setNewQ] = useState({
        text: '', options: ['','','',''], correct: 0, explanation: '', genre: 'tokyo_resort', difficulty: 1
    });

    const handleSubmit = () => {
        if (!newQ.text || newQ.options.some(o => !o)) return alert("全ての項目を入力してください");
        onAddQuestion({
            ...newQ,
            id: `manual_${Date.now()}`,
            isAutoGenerated: false 
        });
        setIsAdding(false);
        setNewQ({ text: '', options: ['','','',''], correct: 0, explanation: '', genre: 'tokyo_resort', difficulty: 1 });
        alert("問題を追加しました！");
    };

    if (isAdding) {
        return (
            <div className="glass-card" style={{textAlign:'left'}}>
                 <button onClick={() => setIsAdding(false)} style={{background:'transparent', border:'none', color:'white', marginBottom:'10px'}}>← キャンセル</button>
                 <h2 className="title">新しい問題を作成</h2>
                 
                 <div style={{display:'flex', flexDirection:'column', gap:'15px', maxHeight:'60vh', overflowY:'auto', paddingRight:'10px'}}>
                     <div>
                        <label>問題文</label>
                        <textarea 
                            style={{width:'100%', padding:'10px', borderRadius:'8px', marginTop:'5px', color:'black'}}
                            rows={3}
                            value={newQ.text}
                            onChange={(e) => setNewQ({...newQ, text: e.target.value})}
                        />
                     </div>
                     <div>
                        <label>選択肢 (1つ目を正解として入力)</label>
                        {newQ.options.map((opt, i) => (
                            <div key={i} style={{marginTop:'5px', display:'flex', gap:'10px', alignItems:'center'}}>
                                <input 
                                    type="radio" 
                                    name="correct" 
                                    checked={newQ.correct === i} 
                                    onChange={() => setNewQ({...newQ, correct: i})}
                                />
                                <input 
                                    type="text" 
                                    value={opt}
                                    placeholder={`選択肢 ${i+1}`}
                                    style={{flex:1, padding:'8px', borderRadius:'5px', color:'black'}}
                                    onChange={(e) => {
                                        const newOpts = [...newQ.options];
                                        newOpts[i] = e.target.value;
                                        setNewQ({...newQ, options: newOpts});
                                    }}
                                />
                                {newQ.correct === i && <span style={{color:'#4ade80'}}>正解</span>}
                            </div>
                        ))}
                     </div>
                     <div>
                        <label>解説</label>
                         <textarea 
                            style={{width:'100%', padding:'10px', borderRadius:'8px', marginTop:'5px', color:'black'}}
                            rows={2}
                            value={newQ.explanation}
                            onChange={(e) => setNewQ({...newQ, explanation: e.target.value})}
                        />
                     </div>
                     <div style={{display:'flex', gap:'10px'}}>
                         <div style={{flex:1}}>
                            <label>ジャンル</label>
                            <select 
                                style={{width:'100%', padding:'10px', borderRadius:'5px', color:'black'}}
                                value={newQ.genre}
                                onChange={(e) => setNewQ({...newQ, genre: e.target.value})}
                            >
                                {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                         </div>
                         <div style={{flex:1}}>
                            <label>難易度</label>
                            <select 
                                style={{width:'100%', padding:'10px', borderRadius:'5px', color:'black'}}
                                value={newQ.difficulty}
                                onChange={(e) => setNewQ({...newQ, difficulty: Number(e.target.value)})}
                            >
                                {[1,2,3,4,5].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                         </div>
                     </div>
                 </div>
                 
                 <button className="start-btn" onClick={handleSubmit} style={{marginTop:'20px'}}>
                     保存する
                 </button>
            </div>
        )
    }

    return (
        <div className="glass-card">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <button onClick={onBack} style={{background:'transparent', border:'none', color:'white'}}>← Back</button>
                <h2 className="title" style={{margin:0}}>問題一覧</h2>
                <button onClick={() => setIsAdding(true)} style={{padding:'5px 15px', borderRadius:'20px', background:'#4ade80', color:'white', border:'none', cursor:'pointer'}}>＋ 新規作成</button>
             </div>
             
             <div style={{maxHeight:'60vh', overflowY:'auto', textAlign:'left'}}>
                 {questions.map((q, i) => (
                     <div key={q.id || i} style={{padding:'10px', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                         <div style={{fontWeight:'bold'}}>{q.text}</div>
                         <div style={{fontSize:'0.8rem', opacity:0.7, marginTop:'5px'}}>
                             Genre: {q.genre} / Lv.{q.difficulty} / {q.isAutoGenerated ? 'AI' : 'Manual/Base'}
                         </div>
                         <div style={{fontSize:'0.8rem', color:'#4ade80'}}>A: {q.options[q.correct]}</div>
                     </div>
                 ))}
             </div>
             <p style={{textAlign:'center', fontSize:'0.8rem', opacity:0.6, marginTop:'10px'}}>Total: {questions.length} questions</p>
        </div>
    );
};

const MenuScreen = ({ onStart, allQuestionsCount, onGenerate, isGenerating, onEnterOnline, onEnterLibrary, onUpload }) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedCount, setSelectedCount] = useState(10); 
  const canStart = selectedGenre && selectedDifficulty && selectedCount;

  return (
    <div className="glass-card">
      <div style={{textAlign: 'center', marginBottom: '10px'}}>
        <img src="/logo.svg" alt="Disney Quiz Logo" style={{width: '80px', height: '80px', filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'}} />
      </div>
      <h1 className="title">Disney Quiz</h1>
      <p className="subtitle">ディズニーの魔法の世界へようこそ</p>
      
      <div style={{marginBottom: '10px'}}>
        <button 
            className="ai-btn" 
            onClick={onGenerate} 
            disabled={isGenerating}
            style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: isGenerating ? 'wait' : 'pointer',
                opacity: isGenerating ? 0.7 : 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            {isGenerating ? (
                <>
                   <span className="spinner">✨</span> 生成中...
                </>
            ) : (
                <>
                   <span>🤖</span> 最新ニュースからクイズ生成
                </>
            )}
        </button>
      </div>

      <div style={{marginBottom: '20px'}}>
         <button onClick={onEnterLibrary} style={{
             background: 'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'white', 
             width: '100%', padding: '10px', borderRadius:'10px', cursor:'pointer'
         }}>
             📚 問題一覧 / 作成
         </button>
         <button onClick={onUpload} style={{
             background: 'transparent', border:'none', color:'rgba(255,255,255,0.5)', 
             width: '100%', padding: '5px', fontSize: '0.8rem', cursor:'pointer', marginTop: '5px'
         }}>
             ☁️ DBへアップロード (管理者用)
         </button>
      </div>

      <div className="selection-group">
        <label className="label">プレイモード</label>
        <div className="grid-buttons">
            <button className="option-btn" onClick={() => onStart(null, null, 10, false, 'solo_setup')}>
               👤 1人で遊ぶ (Solo)
            </button>
             <button className="option-btn" onClick={onEnterOnline} style={{background: 'linear-gradient(45deg, #ff416c, #ff4b2b)', fontWeight: 'bold'}}>
               ⚔️ オンライン対戦 (Online)
            </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
              className="option-btn"
              onClick={() => navigate('/')}
              style={{ padding: '10px 30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '25px', fontSize: '0.9rem' }}
          >
              ↩️ Home
          </button>
      </div>

      <p style={{textAlign: 'center', opacity: 0.8, fontSize: '0.9rem', marginTop: '20px'}}>現在 {allQuestionsCount} 問の問題が収録されています</p>
    </div>
  );
};

const SoloSetupScreen = ({ onStartBack, onStartGame }) => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [selectedCount, setSelectedCount] = useState(10);
  
  const canStart = selectedGenre && selectedDifficulty && selectedCount;

  return (
      <div className="glass-card">
          <button onClick={onStartBack} style={{background:'transparent', border:'none', color:'white', fontSize:'1.2rem', cursor:'pointer', marginBottom:'10px'}}>← Back</button>
          <h2 className="title">Solo Play</h2>
          
           <div className="selection-group">
            <label className="label">ジャンルを選択</label>
            <div className="grid-buttons">
              {categories.map((cat) => (
                <button key={cat.id} className={`option-btn ${selectedGenre === cat.id ? 'selected' : ''}`} onClick={() => setSelectedGenre(cat.id)}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
           <div className="selection-group">
            <label className="label">難易度を選択: <strong style={{color: '#4ade80'}}>LEVEL {selectedDifficulty}</strong></label>
            <input
                type="range"
                min="1"
                max="5"
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(Number(e.target.value))}
                style={{width: '100%', accentColor: '#4ade80', marginTop: '8px'}}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6}}>
                <span>1</span><span>3</span><span>5</span>
            </div>
          </div>
          
          <div className="selection-group">
            <label className="label">問題数: <strong style={{color: '#4ade80'}}>{selectedCount}問</strong></label>
            <input
                type="range"
                min="1"
                max="100"
                value={selectedCount}
                onChange={e => setSelectedCount(Number(e.target.value))}
                style={{width: '100%', accentColor: '#4ade80', marginTop: '8px'}}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6}}>
                <span>1</span><span>50</span><span>100</span>
            </div>
          </div>

          <button 
            className="start-btn"
            disabled={!canStart}
            style={{ opacity: canStart ? 1 : 0.5 }}
            onClick={() => onStartGame(selectedGenre, selectedDifficulty, selectedCount)}
          >
            START
          </button>
      </div>
  )
}



const QuizScreen = ({ questions, onFinish, mode, peerData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({}); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [buzzerWinner, setBuzzerWinner] = useState(null); 
  const [feedbackText, setFeedbackText] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(15);
  const MAX_TIME = 15;

  const [isQuestionFullyDisplayed, setIsQuestionFullyDisplayed] = useState(false);
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const showExitConfirmRef = useRef(false);
  useEffect(() => { showExitConfirmRef.current = showExitConfirm; }, [showExitConfirm]);

  const navigate = useNavigate();
  const { connections, isHost, sendData, myId, myName: myNameProp } = peerData || {};
  const isOnline = mode === 'online';

  const myPlayerId = isHost ? 'p1' : (myId || 'guest');
  const myName = myNameProp || (isHost ? 'Host' : 'Guest');

  const [playerNames, setPlayerNames] = useState({});

  useEffect(() => {
      if (isOnline) {
          setScores({ [myPlayerId]: 0 });
          setPlayerNames({ [myPlayerId]: myName });
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <div>Loading...</div>;

  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    setTimeLeft(MAX_TIME);
    setIsQuestionFullyDisplayed(false);
    setHasBuzzed(false);
  }, [currentIndex]);

  useEffect(() => {
    if (showFeedback || (isOnline && buzzerWinner) || !isQuestionFullyDisplayed || showExitConfirm) return;

    if (timeLeft <= 0) {
        if (!isOnline || isHost) {
            handleTimeout();
        }
        return;
    }

    const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, buzzerWinner, isOnline, isHost, isQuestionFullyDisplayed, showExitConfirm]);

  const handleTimeout = () => {
     setShowFeedback(true);
     setFeedbackText('⏰ 時間切れ！');
     setBuzzerWinner(null); 
     setTimeLeft(0);
     
     if (isOnline && isHost) {
         sendData({ type: 'sync_state', payload: { action: 'timeout' } });
     }
  };

  useEffect(() => {
    if (!isOnline || !connections) return;

    const handleData = (data) => {
        if (data.type === 'buzz') {
            setBuzzerWinner(data.playerId);
            setIsQuestionFullyDisplayed(true);
            if (data.playerName) setPlayerNames(prev => ({ ...prev, [data.playerId]: data.playerName }));
        }

        if (data.type === 'sync_state') {
            const { action, newScores, winnerId, correct, playerName: winnerName } = data.payload;

            if (action === 'timeout') {
                setShowFeedback(true);
                setFeedbackText('⏰ 時間切れ！');
                setTimeLeft(0);
                setBuzzerWinner(null);
                setIsQuestionFullyDisplayed(true);
            }
            if (action === 'answer_result') {
                setShowFeedback(true);
                if (newScores) setScores(prev => ({ ...prev, ...newScores }));
                if (winnerName) setPlayerNames(prev => ({ ...prev, [winnerId]: winnerName }));

                const isWinnerMe = winnerId === myPlayerId;
                const winnerDisplay = winnerName || (winnerId === 'p1' ? 'Host' : 'Guest');
                setFeedbackText(correct
                    ? (isWinnerMe ? '正解！' : `${winnerDisplay}が正解しました！`)
                    : (isWinnerMe ? '残念...' : `${winnerDisplay}が不正解でした！`)
                );
                setIsQuestionFullyDisplayed(true);
            }
            if (action === 'next_question') {
                handleNext(true);
            }
        }
    };

    connections.forEach(conn => {
        // Simple attachment
    });
    
    if (peerData.registerDataHandler) {
        return peerData.registerDataHandler(handleData);
    }

  }, [connections, isOnline, isHost, myPlayerId, peerData]);

  useEffect(() => {
      if (showFeedback && !showExitConfirm) {
          if (isOnline && !isHost) return;

          const timer = setTimeout(() => {
              handleNext();
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [showFeedback, showExitConfirm, isOnline, isHost]);

  const handleAnswer = (index) => {
    if (selectedOption !== null || showFeedback) return;
    
    // Ensure text is fully displayed before answering (optional preference, but good for fairness)
    if (!isQuestionFullyDisplayed) {
        setIsQuestionFullyDisplayed(true);
        // Depending on UX, you might want to return here to prevent accidental clicks while typing, 
        // OR allow the click to register immediately. 
        // For now, let's allow it to register immediately *after* completing the text.
    }
    
    if (isOnline) {
        if (buzzerWinner && buzzerWinner !== myPlayerId) return; 
        if (!buzzerWinner) {
             setBuzzerWinner(myPlayerId);
             sendData({ type: 'buzz', playerId: myPlayerId }); 
        }
    }

    setSelectedOption(index);
    setShowFeedback(true);
    
    const isCorrect = index === currentQuestion.correct;
    
    const currentScore = scores[myPlayerId] || 0;
    const newScores = { ...scores, [myPlayerId]: currentScore + (isCorrect ? 1 : 0) };
    
    if (isCorrect) {
       setScores(newScores);
       confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    
    setFeedbackText(isCorrect ? '正解！' : '残念...');
    
    if (isOnline) {
        sendData({ 
            type: 'sync_state', 
            payload: { 
                action: 'answer_result',
                newScores: newScores, 
                winnerId: myPlayerId,
                correct: isCorrect
            } 
        });
    }
  };

  const handleNext = (remoteTriggered = false) => {
    if (showExitConfirmRef.current) return; // 退出ダイアログ中は進行しない
    if (isOnline && !remoteTriggered) {
        if (!isHost) return;
        sendData({ type: 'sync_state', payload: { action: 'next_question' } });
    }

    if (isLast) {
      onFinish(scores);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setBuzzerWinner(null);
      setTimeLeft(MAX_TIME);
      setIsQuestionFullyDisplayed(false);
    }
  };

  // みんはや形式の回答ハンドラ
  const submitMinnaya = (isCorrect) => {
    if (selectedOption !== null || showFeedback) return;
    setIsQuestionFullyDisplayed(true);
    setSelectedOption(isCorrect ? currentQuestion.correct : -1);
    setShowFeedback(true);
    const newScores = { ...scores, [myPlayerId]: (scores[myPlayerId] || 0) + (isCorrect ? 1 : 0) };
    if (isCorrect) {
      setScores(newScores);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    }
    setFeedbackText(isCorrect ? '正解！🎉' : '残念...');
    if (isOnline) {
      sendData({ type: 'sync_state', payload: { action: 'answer_result', newScores, winnerId: myPlayerId, correct: isCorrect, playerName: myName } });
    }
  };

  // 早押しボタン
  const handleBuzzIn = () => {
    if (hasBuzzed || showFeedback) return;
    setHasBuzzed(true);
    setIsQuestionFullyDisplayed(true);
    if (isOnline && !buzzerWinner) {
      setBuzzerWinner(myPlayerId);
      sendData({ type: 'buzz', playerId: myPlayerId, playerName: myName });
    }
  };

  const isDisabled = selectedOption !== null || (isOnline && buzzerWinner && buzzerWinner !== myPlayerId) || showFeedback;

  const sortedScores = useMemo(() => {
      if (!isOnline) return [];
      return Object.entries(scores)
        .sort(([,a], [,b]) => b - a);
  }, [scores, isOnline]);

  return (
    <div className="glass-card" style={{position: 'relative'}}>

      {/* ── 中断確認オーバーレイ ── */}
      {showExitConfirm && (
        <div className="exit-overlay">
          <div className="exit-dialog">
            <p className="exit-dialog-msg">ゲームを中断して<br/>ホームに戻りますか？</p>
            <div className="exit-dialog-btns">
              <button className="exit-dialog-yes" onClick={() => navigate('/')}>
                ホームに戻る
              </button>
              <button className="exit-dialog-no" onClick={() => setShowExitConfirm(false)}>
                続ける
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="quiz-header" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
         {isOnline ? (
             <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <span style={{fontSize: '0.8rem', opacity: 0.8}}>LEADERBOARD</span>
                    <div style={{display: 'flex', gap: '15px'}}>
                        {sortedScores.map(([pid, s], i) => (
                            <div key={pid} style={{
                                color: pid === myPlayerId ? '#4ade80' : '#fff',
                                fontWeight: pid === myPlayerId ? 'bold' : 'normal'
                            }}>
                                {i+1}. {playerNames[pid] || (pid === 'p1' ? 'Host' : 'Guest')} : {s}
                            </div>
                        ))}
                        {sortedScores.length === 0 && <div>Waiting for scores...</div>}
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                     <span>Q {currentIndex + 1} / {questions.length}</span>
                     <button className="quiz-home-btn" onClick={() => setShowExitConfirm(true)}>🏠</button>
                </div>
             </div>
         ) : (
            <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems: 'center'}}>
                <span>Q {currentIndex + 1} / {questions.length}</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span>Score: {scores.p1 || scores.me || 0}</span>
                    <button className="quiz-home-btn" onClick={() => setShowExitConfirm(true)}>🏠</button>
                </div>
            </div>
         )}
      </div>

      <div className="timer-bar-container" style={{marginTop: '10px'}}>
          <div className="timer-bar" style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }} />
      </div>
      
      {/* Online buzz status */}
      {isOnline && buzzerWinner && !showFeedback && (
          <div style={{textAlign: 'center', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 'bold',
              color: buzzerWinner === myPlayerId ? '#4ade80' : '#ff4b2b'}}>
              {buzzerWinner === myPlayerId ? '⚡ あなたが回答中！' : '他のプレイヤーが回答中...'}
          </div>
      )}

      {/* Question Text — freezes when someone buzzes in */}
      <TypewriterQuestion
         text={currentQuestion.text}
         onComplete={() => setIsQuestionFullyDisplayed(true)}
         freeze={hasBuzzed || (isOnline && !!buzzerWinner)}
      />

      {/* Buzz-in button — hidden once someone buzzes */}
      {!hasBuzzed && !showFeedback && !(isOnline && buzzerWinner) && (
        <div style={{textAlign: 'center', margin: '18px 0 8px'}}>
          <button className="buzz-btn" onClick={handleBuzzIn}>
            ⚡ 早押し！
          </button>
        </div>
      )}

      {/* Character input — only appears after buzzing in */}
      {hasBuzzed && !showFeedback && (
        <MinnayaInput
          question={currentQuestion}
          disabled={isDisabled}
          onSubmit={submitMinnaya}
          onCharPick={() => setTimeLeft(MAX_TIME)}
        />
      )}

      {showFeedback && (
        <div className="feedback-area">
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'left',
            borderLeft: `4px solid ${selectedOption === currentQuestion.correct ? '#4ade80' : '#ef5350'}`
          }}>
            <h3 style={{margin: '0 0 8px', color: selectedOption === currentQuestion.correct ? '#4ade80' : '#ef5350'}}>
              {feedbackText}
            </h3>
            <div style={{background:'rgba(255,215,0,0.1)', border:'1px solid rgba(255,215,0,0.3)', borderRadius:'8px', padding:'8px 12px', marginBottom:'10px'}}>
              <span style={{color:'#ffd700', fontSize:'0.85rem', marginRight:'6px'}}>正解：</span>
              <span style={{fontWeight:'bold', fontSize:'1.1rem'}}>{currentQuestion.options[currentQuestion.correct]}</span>
            </div>
            <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.85}}>{currentQuestion.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultScreen = ({ scores, totalPerPlayer, onRetry, unlockCount, isVersus, historySaved }) => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rankSaveStatus, setRankSaveStatus] = useState('unsaved'); // unsaved, saving, saved, error

  useEffect(() => {
    // Only fetch leaderboard on mount
    const fetchLB = async () => {
        const lb = await getLeaderboard();
        setLeaderboard(lb);
    };
    fetchLB();

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }, []);

  const handleSaveScore = async () => {
      setRankSaveStatus('saving');
      try {
          // Assume p1 or me is the player
          const myScore = scores.p1 || Object.values(scores)[0] || 0;
          const name = prompt("ランキングに登録する名前を入力してください") || "Anonymous";
          await saveScore(name, myScore);
          setRankSaveStatus('saved');
          
          // Refresh leaderboard
          const lb = await getLeaderboard();
          setLeaderboard(lb);
      } catch (e) {
          console.error(e);
          setRankSaveStatus('error');
      }
  };

  const sortedScores = isVersus 
      ? Object.entries(scores).sort(([,a], [,b]) => b - a)
      : [];

  return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <h2 className="title">Result</h2>
      
      {isVersus ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', alignItems: 'center'}}>
              {sortedScores.map(([pid, s], i) => (
                  <div key={pid} style={{
                      display: 'flex', justifyContent: 'space-between', width: '200px',
                      fontSize: '1.2rem', padding: '10px',
                      background: i===0 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                      border: i===0 ? '1px solid gold' : 'none',
                      borderRadius: '8px'
                  }}>
                      <span>{i+1}. {pid === 'p1' ? 'Host' : pid}</span>
                      <span style={{fontWeight: 'bold'}}>{s}</span>
                  </div>
              ))}
          </div>
      ) : (
          <>
            <p className="subtitle">あなたのスコア</p>
            <div className="result-score">
                 {scores.p1 || Object.values(scores)[0] || 0} / {totalPerPlayer}
            </div>
          </>
      )}

      {/* Leaderboard Section */}
      <div style={{marginTop: '30px', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px'}}>
          <h3 style={{color: '#ffd700', marginTop: 0}}>🏆 Leaderboard</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto'}}>
              {leaderboard.map((entry, i) => (
                  <div key={entry.id || i} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                      <span>{i+1}. {entry.name}</span>
                      <span>{entry.score}点</span>
                  </div>
              ))}
          </div>
          
          {rankSaveStatus === 'unsaved' && !isVersus && (
              <button 
                onClick={handleSaveScore} 
                style={{marginTop: '15px', background: '#4ade80', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'}}
              >
                  ランキングに登録
              </button>
          )}
          {rankSaveStatus === 'saved' && <p style={{color: '#4ade80'}}>登録しました！</p>}
      </div>
      
      {historySaved && (
          <p style={{color: '#4ade80', fontSize: '13px', margin: '8px 0'}}>📊 クイズ履歴を保存しました</p>
      )}

      <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
        <button className="start-btn" onClick={onRetry} style={{margin: 0}}>
          メインメニューに戻る
        </button>
        <button
          onClick={() => navigate('/stats')}
          style={{padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.5)', background: 'transparent', color: '#ffd700', cursor: 'pointer', fontSize: '14px'}}
        >
          📊 成績を見る
        </button>
      </div>

      {unlockCount > 0 && (
         <div className="auto-add-badge">
           新しい問題が{unlockCount}問追加されました！
         </div>
      )}
    </div>
  );
};

function QuizPage() {
  const { data: session } = useSession();
  const [gameState, setGameState] = useState('menu');
  const [allQuestions, setAllQuestions] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [lastResults, setLastResults] = useState({ scores: {}, total: 0, historySaved: false });
  const [gameMeta, setGameMeta] = useState({ genre: 'all', difficulty: 3 });
  const [newlyAddedCount, setNewlyAddedCount] = useState(0);
  const [isVersusMode, setIsVersusMode] = useState(false);
  const [clearedQuestions, setClearedQuestions] = useState([]); 
  
  const { peerId, connectToPeer, connections, broadcast, isConnecting, connectionError } = usePeer();
  
  const connList = connections;
  const safeBroadcast = broadcast || ((data) => connList.forEach(c => c.open && c.send(data)));

  const [isHost, setIsHost] = useState(false);
  const [dataListeners, setDataListeners] = useState([]); 

  const [didIConnect, setDidIConnect] = useState(false);
  useEffect(() => {
     if (peerId && !didIConnect) setIsHost(true);
  }, [peerId, didIConnect]);
  
  useEffect(() => {
      if (!connList) return;
      const handler = (data) => {
          // Global handlers
          if (data.type === 'start_game') {
              console.log('Received start_game event', data);
              setGameQuestions(data.questions);
              setIsVersusMode(true);
              setGameState('playing');
          }

          // Component listeners
          dataListeners.forEach(cb => cb(data));
      };
      
      connList.forEach(conn => {
          conn.off('data'); // Remove previous listeners to avoid duplicates
          conn.on('data', handler);
      });

      return () => {
          connList.forEach(conn => conn.off('data'));
      };
  }, [connList, dataListeners]);

  const registerDataHandler = (cb) => {
      setDataListeners(prev => [...prev, cb]);
      return () => setDataListeners(prev => prev.filter(c => c !== cb));
  };

  useEffect(() => {
    // Generate questions from facilities
    const facilityQuestions = facilities.map(f => {
        // 1. Where is [Facility] located?
        const areaOptions = ['ファンタジーランド', 'トゥモローランド', 'アドベンチャーランド', 'ウエスタンランド', 'クリッターカントリー', 'トゥーンタウン', 'ワールドバザール', 'メディテレーニアンハーバー', 'アメリカンウォーターフロント', 'ポートディスカバリー', 'ロストリバーデルタ', 'アラビアンコースト', 'マーメイドラグーン', 'ミステリアスアイランド'];
        
        // Filter options to include correct answer and random others
        let wrongOptions = areaOptions.filter(a => a !== f.area).sort(() => 0.5 - Math.random()).slice(0, 3);
        let options = [f.area, ...wrongOptions].sort(() => 0.5 - Math.random());
        
        return {
            id: `fac_${f.id}_area`,
            text: `「${f.name}」があるエリアはどこ？`,
            options: options,
            correct: options.indexOf(f.area),
            explanation: `「${f.name}」は${f.park === 'land' ? '東京ディズニーランド' : '東京ディズニーシー'}の${f.area}にあります。`,
            genre: f.park === 'land' ? 'tokyo_disneyland' : 'tokyo_disneySea',
            difficulty: 2, // Basic knowledge
            isAutoGenerated: true
        };
    });

    // Merge with base questions
    const baseQ = generateInitialQuestions();
    const allQ = [...baseQ, ...facilityQuestions];
    
    // Load Custom/AI questions (Local Storage)
    const savedCustom = localStorage.getItem('disney_quiz_custom_questions');
    if (savedCustom) {
        setAllQuestions([...allQ, ...JSON.parse(savedCustom)]);
    } else {
        setAllQuestions(allQ);
    }
  }, []);

  const handleUploadToFirestore = async () => {
      if (window.confirm('現在のローカルデータをFirestoreにアップロードしますか？\n(問題データと施設データの両方がアップロードされます。\n※既存データに追記されます)')) {
          const qResult = await uploadQuestionsToFirestore();
          const fResult = await uploadFacilitiesToFirestore();
          
          if (qResult.success && fResult.success) alert('全てのデータをアップロードしました！');
          else if (qResult.success) alert('問題データのアップロードは成功しましたが、施設データのアップロードに失敗しました。');
          else if (fResult.success) alert('施設データのアップロードは成功しましたが、問題データのアップロードに失敗しました。');
          else alert('アップロードに失敗しました。');
      }
  };

  const saveCustomQuestions = (newQuestions) => {
      const savedCustom = localStorage.getItem('disney_quiz_custom_questions');
      let customQs = savedCustom ? JSON.parse(savedCustom) : [];
      
      const updatedCustom = [...customQs, ...newQuestions];
      localStorage.setItem('disney_quiz_custom_questions', JSON.stringify(updatedCustom));
      
      setAllQuestions(prev => {
           const existingIds = new Set(prev.map(q => q.id));
           const uniqueNew = newQuestions.filter(q => !existingIds.has(q.id));
           return [...prev, ...uniqueNew];
      });
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-quiz', { method: 'POST' });
      if (!res.ok) throw new Error('Generation failed');
      const newQuestions = await res.json();
      
      const formatted = newQuestions.map((q, i) => ({
        ...q,
        id: `ai_${Date.now()}_${i}`,
        isAutoGenerated: true,
      }));

      saveCustomQuestions(formatted);
      
      alert(`クイズ生成完了！ ${formatted.length}問追加されました`);
    } catch (e) {
      alert('API設定を確認してください');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualQuestion = (qData) => {
      saveCustomQuestions([qData]);
  };
  
  const handleEnterOnline = () => setGameState('online_menu');

  const startGameSolo = (genre, difficulty, count) => {
      let filtered = allQuestions.filter(q => q.difficulty === difficulty);
      if (genre !== 'all') filtered = filtered.filter(q => q.genre === genre);
      if (filtered.length === 0) return alert('No questions found');

      const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, count)
         .map(q => {
             const correctText = q.options[q.correct];
             const shuffledOpts = [...q.options].sort(() => 0.5 - Math.random());
             return {
                 ...q,
                 options: shuffledOpts,
                 correct: shuffledOpts.indexOf(correctText)
             };
          });

      setGameMeta({ genre, difficulty });
      setGameQuestions(selected);
      setIsVersusMode(false);
      setGameState('playing');
  }

  const [playerName, setPlayerName] = useState('');

  const handleConnect = (id) => {
      connectToPeer(id);
      setIsHost(false);
  }

  const handleGuestConnect = (id, name = '') => {
      setDidIConnect(true);
      setPlayerName(name);
      connectToPeer(id);
      setIsHost(false);
  }

  const startOnlineGame = (count = 10, genre = 'all', difficulty = 3, hostName = '') => {
      setPlayerName(hostName);
      let filtered = allQuestions.filter(q => !q.isAutoGenerated);
      if (genre !== 'all') filtered = filtered.filter(q => q.genre === genre);
      filtered = filtered.filter(q => q.difficulty === difficulty);

      if (filtered.length === 0) {
          alert('条件に合う問題がありません。ジャンルや難易度を変えてください。');
          return;
      }

      const selectedInfo = filtered
          .sort(() => 0.5 - Math.random())
          .slice(0, count)
          .map(q => {
             const correctText = q.options[q.correct];
             const shuffledOpts = [...q.options].sort(() => 0.5 - Math.random());
             return {
                 ...q,
                 options: shuffledOpts,
                 correct: shuffledOpts.indexOf(correctText)
             };
          });

      setGameQuestions(selectedInfo);
      safeBroadcast({ type: 'start_game', questions: selectedInfo });
      setGameState('playing');
      setIsVersusMode(true);
  };

  const finishGame = async (scores) => {
    const total = gameQuestions.length;
    let historySaved = false;

    // ログイン済みかつソロモードのみ履歴を保存
    if (session?.user && !isVersusMode) {
        const myScore = scores.p1 || Object.values(scores)[0] || 0;
        try {
            await saveQuizHistory(session.user.id, gameMeta.genre, gameMeta.difficulty, myScore, total);
            historySaved = true;
        } catch (e) {
            console.error('Failed to save quiz history:', e);
        }
    }

    setLastResults({ scores, total, historySaved });
    setGameState('result');
  };

  return (
    <div className="app-container" style={{paddingTop: 'clamp(12px, 3vh, 40px)'}}>
      {gameState === 'menu' && (
          <MenuScreen 
            onStart={(...args) => { if (args[4] === 'solo_setup') setGameState('solo_setup'); }} 
            allQuestionsCount={allQuestions.length} 
            onGenerate={handleGenerateQuiz}
            isGenerating={isGenerating}
            onEnterOnline={handleEnterOnline}
            onEnterLibrary={() => setGameState('library')}
            onUpload={handleUploadToFirestore}
          />
      )}
      
      {gameState === 'library' && (
          <LibraryScreen 
             questions={allQuestions}
             onBack={() => setGameState('menu')}
             onAddQuestion={handleAddManualQuestion}
          />
      )}
      
      {gameState === 'solo_setup' && <SoloSetupScreen onStartBack={() => setGameState('menu')} onStartGame={startGameSolo} />}

      {gameState === 'online_menu' && (
          <OnlineMenu 
             peerId={peerId}
             onConnect={handleGuestConnect}
             isConnected={(connList && connList.length > 0)}
             onStartOnlineGame={startOnlineGame}
             isHost={isHost}
             connectionCount={connList ? connList.length : 0}
             isConnecting={isConnecting}
             connectionError={connectionError}
             onBack={() => setGameState('menu')}
          />
      )}

      {gameState === 'playing' && (
          <QuizScreen 
            questions={gameQuestions} 
            onFinish={finishGame}
            mode={isVersusMode ? 'online' : 'solo'}
            peerData={{ connections: connList, isHost, sendData: safeBroadcast, registerDataHandler, myId: peerId, myName: playerName }}
          />
      )}
      
      {gameState === 'result' && (
        <ResultScreen
          scores={lastResults.scores}
          totalPerPlayer={lastResults.total}
          onRetry={() => { setGameState('menu'); }}
          isVersus={isVersusMode}
          historySaved={lastResults.historySaved}
        />
      )}
    </div>
  );
}

export default QuizPage;
