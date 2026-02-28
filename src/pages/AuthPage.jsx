import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function AuthPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // セッション確定後のみリダイレクト（isPending中は絶対に飛ばない）
  useEffect(() => {
    if (!isPending && session?.user) {
      navigate('/');
    }
  }, [session, isPending, navigate]);

  // セッション確認中
  if (isPending) {
    return (
      <div style={{ ...styles.container }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>読み込み中...</div>
      </div>
    );
  }

  // 10秒でタイムアウトするラッパー
  const withTimeout = (promise, ms = 10000) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('タイムアウト: サーバーに接続できませんでした')), ms)
      ),
    ]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await withTimeout(
        authClient.signIn.social({ provider: 'google', callbackURL: '/' })
      );
      // Google はリダイレクトするので通常ここには到達しない
    } catch (err) {
      setError(err.message || 'Googleログインに失敗しました');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await withTimeout(
          authClient.signIn.email({ email, password })
        );
        if (result?.error) throw new Error(result.error.message || 'ログインに失敗しました');
      } else {
        const result = await withTimeout(
          authClient.signUp.email({ email, password, name })
        );
        if (result?.error) throw new Error(result.error.message || '登録に失敗しました');
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'エラーが発生しました。しばらく後にもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Disney Quiz</h1>

        {/* Google ログイン（メイン） */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleBtn}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Googleでログイン
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>または</span>
          <span style={styles.dividerLine} />
        </div>

        {/* メール/パスワード */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => setMode('login')}
          >
            ログイン
          </button>
          <button
            style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
            onClick={() => setMode('signup')}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>名前</label>
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="表示名"
                required
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>メールアドレス</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>パスワード</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              required
              minLength={8}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '登録する'}
          </button>
        </form>

        <button style={styles.guestBtn} onClick={() => navigate('/')}>
          ゲストとして続ける →
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#FFD700',
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '24px',
    fontWeight: 'bold',
  },
  googleBtn: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: '#fff',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.2)',
    display: 'block',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabActive: {
    background: '#FFD700',
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    textAlign: 'center',
  },
  submitBtn: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#FFD700',
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  guestBtn: {
    display: 'block',
    width: '100%',
    marginTop: '16px',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'center',
  },
};
