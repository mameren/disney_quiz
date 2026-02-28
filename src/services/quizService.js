// ─── Leaderboard (Turso経由) ──────────────────────────────────────────────────

/**
 * スコアをTursoに保存する
 * @param {string} userName
 * @param {number} score
 */
export const saveScore = async (userName, score) => {
    const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName || 'Anonymous', score }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save score');
    }
    return { success: true };
};

/**
 * トップスコアを取得する
 * @param {number} limitCount
 */
export const getLeaderboard = async (limitCount = 10) => {
    const res = await fetch(`/api/leaderboard?limit=${limitCount}`);
    if (!res.ok) {
        throw new Error('Failed to fetch leaderboard');
    }
    const rows = await res.json();
    // Firebase互換の形に整形 (id, name, score)
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        score: row.score,
    }));
};

// ─── Quiz History (Turso経由) ──────────────────────────────────────────────────

/**
 * クイズ結果を保存する
 */
export const saveQuizHistory = async (userId, genre, difficulty, correct, total) => {
    const res = await fetch('/api/quiz-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, genre, difficulty, correct, total }),
    });
    if (!res.ok) throw new Error('Failed to save quiz history');
    return { success: true };
};

/**
 * ユーザーのジャンル別正答率を取得する
 */
export const getQuizHistory = async (userId) => {
    const res = await fetch(`/api/quiz-history?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch quiz history');
    return await res.json();
};

// ─── 旧Firebase関数（未使用・互換のため残す） ────────────────────────────────

export const fetchQuestions = async () => [];

export const uploadQuestionsToFirestore = async () => ({ success: false, message: 'Tursoに移行済み' });

export const uploadFacilitiesToFirestore = async () => ({ success: false, message: 'Tursoに移行済み' });
