import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';

const features = [
  {
    icon: '🏆',
    title: 'ディズニークイズ',
    desc: 'キャラクター・アトラクション・歴史まで幅広いジャンルから出題。1人でも友達との早押し対戦も楽しめる！',
    cta: 'クイズを始める →',
    path: '/quiz',
    accent: 'rgba(174, 99, 228, 0.5)',
  },
  {
    icon: '🎡',
    title: 'アトラクション\nルーレット',
    desc: '「次はどこ行く？」と迷ったときのコンパス。ランド・シー・両方から条件を絞ってスピン！',
    cta: 'ルーレットを回す →',
    path: '/roulette',
    accent: 'rgba(255, 64, 129, 0.5)',
  },
  {
    icon: '🗓️',
    title: '来園プラン作成',
    desc: '誰と・何人で・どんなペースで回る？あなたの条件に合わせた当日プランをAIが自動生成。',
    cta: 'プランを作る →',
    path: '/plan',
    accent: 'rgba(0, 188, 212, 0.5)',
  },
];

const stats = [
  { value: '300+', label: 'クイズ問題数' },
  { value: '700+', label: 'アトラクション数' },
  { value: '3', label: '便利な機能' },
  { value: '∞', label: '楽しみ方' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  return (
    <div className="home-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🏰 ディズニーファン向け無料アプリ</div>
          <h1 className="hero-title">
            ディズニーをもっと<br />
            <span className="hero-title-accent">深く、もっと楽しく。</span>
          </h1>
          <p className="hero-subtitle">
            クイズで知識を試して、ルーレットで次の行き先を決めて、<br />
            AIプランで最高の1日を設計しよう。
          </p>
          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => navigate('/quiz')}>
              クイズを無料で始める →
            </button>
            <button className="cta-secondary" onClick={() => navigate('/roulette')}>
              ルーレットを試す
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-inner">
          {stats.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow">FEATURES</p>
          <h2 className="section-title">3つの機能で<br />ディズニーライフを充実させよう</h2>
          <div className="features-grid">
            {features.map(({ icon, title, desc, cta, path, accent }) => (
              <div
                key={path}
                className="feature-card"
                style={{ '--card-accent': accent }}
                onClick={() => navigate(path)}
              >
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title" style={{ whiteSpace: 'pre-line' }}>{title}</h3>
                <p className="feature-desc">{desc}</p>
                <span className="feature-cta">{cta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2 className="cta-banner-title">さっそく試してみよう</h2>
          <p className="cta-banner-sub">
            {session?.user
              ? `こんにちは、${session.user.name || session.user.email} さん！`
              : 'ログインすると成績の記録・ジャンル別正答率が確認できます。'}
          </p>
          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => navigate('/quiz')}>
              クイズを始める →
            </button>
            {!session?.user && (
              <button className="cta-secondary" onClick={() => navigate('/auth')}>
                無料ログイン
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="site-footer">
        <p>Designed for Disney Fans &nbsp;·&nbsp; © 2026 Pocket Jiminy</p>
      </footer>
    </div>
  );
}
