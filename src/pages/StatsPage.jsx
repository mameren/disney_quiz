import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';
import { getQuizHistory } from '../services/quizService';

const GENRE_LABELS = {
  tokyo_resort: '東京ディズニーリゾート',
  disney_movies: 'ディズニー映画',
  world_parks: '世界のディズニーランド',
  walt_disney: 'ウォルト・ディズニー',
  all: 'オールジャンル',
  tokyo_disneyland: '東京ディズニーランド',
  tokyo_disneySea: '東京ディズニーシー',
};

export default function StatsPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      navigate('/auth');
      return;
    }
    getQuizHistory(session.user.id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, isPending, navigate]);

  const totalPlays = stats.reduce((sum, s) => sum + Number(s.plays), 0);
  const totalCorrect = stats.reduce((sum, s) => sum + Number(s.total_correct), 0);
  const totalQuestions = stats.reduce((sum, s) => sum + Number(s.total_questions), 0);
  const overallRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate('/')} style={styles.back}>← ホームに戻る</button>
        <h1 style={styles.title}>📊 クイズ成績</h1>
        {session?.user && (
          <p style={styles.user}>👤 {session.user.name || session.user.email}</p>
        )}

        {loading ? (
          <p style={styles.empty}>読み込み中...</p>
        ) : stats.length === 0 ? (
          <div style={styles.emptyBlock}>
            <p style={styles.empty}>まだプレイ履歴がありません。</p>
            <button onClick={() => navigate('/quiz')} style={styles.startBtn}>クイズをプレイする</button>
          </div>
        ) : (
          <>
            {/* 総合成績 */}
            <div style={styles.overallCard}>
              <div style={styles.overallLabel}>総合正答率</div>
              <div style={styles.overallRate}>
                {overallRate !== null ? `${overallRate}%` : '-'}
              </div>
              <div style={styles.overallSub}>
                {totalCorrect} / {totalQuestions}問正解 &nbsp;·&nbsp; {totalPlays}回プレイ
              </div>
            </div>

            {/* ジャンル別 */}
            <h3 style={styles.sectionTitle}>ジャンル別正答率</h3>
            <div style={styles.genreList}>
              {stats.map((row) => {
                const rate = Number(row.total_questions) > 0
                  ? Math.round((Number(row.total_correct) / Number(row.total_questions)) * 100)
                  : 0;
                return (
                  <div key={row.genre} style={styles.genreRow}>
                    <div style={styles.genreInfo}>
                      <span style={styles.genreName}>
                        {GENRE_LABELS[row.genre] || row.genre}
                      </span>
                      <span style={styles.genreDetail}>
                        {row.total_correct}/{row.total_questions}問 · {row.plays}回
                      </span>
                    </div>
                    <div style={styles.barWrapper}>
                      <div style={{ ...styles.bar, width: `${rate}%`, background: rateColor(rate) }} />
                    </div>
                    <span style={{ ...styles.rateText, color: rateColor(rate) }}>{rate}%</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => navigate('/quiz')} style={styles.startBtn}>
              クイズをプレイする
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function rateColor(rate) {
  if (rate >= 80) return '#4ade80';
  if (rate >= 60) return '#fbbf24';
  return '#f87171';
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
    paddingTop: '40px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
  },
  back: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
    marginBottom: '16px',
    display: 'block',
  },
  title: {
    color: '#FFD700',
    fontSize: '24px',
    margin: '0 0 4px',
  },
  user: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    margin: '0 0 24px',
  },
  overallCard: {
    background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  overallLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' },
  overallRate: { color: '#FFD700', fontSize: '48px', fontWeight: 'bold', lineHeight: 1 },
  overallSub: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' },
  sectionTitle: { color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 12px' },
  genreList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  genreRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  genreInfo: { width: '140px', flexShrink: 0 },
  genreName: { display: 'block', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
  genreDetail: { display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '11px' },
  barWrapper: { flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' },
  bar: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  rateText: { width: '36px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 },
  empty: { color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  emptyBlock: { textAlign: 'center' },
  startBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#FFD700',
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
};
