import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../lib/auth-client';

const HomePage = () => {
    const navigate = useNavigate();
    const { data: session } = useSession();

    return (
            <div className="glass-card home-card">
                {/* <div className="logo-container">
                    <img src="/logo.svg" alt="Pocket Jiminy" className="logo-img" />
                </div> */}

                {/* ログイン状態バッジ */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    {session?.user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                👤 {session.user.name || session.user.email}
                            </span>
                            <button
                                onClick={() => navigate('/stats')}
                                style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.4)', background: 'transparent', color: 'rgba(255,215,0,0.8)', cursor: 'pointer' }}
                            >
                                📊 成績
                            </button>
                            <button
                                onClick={() => signOut()}
                                style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                            >
                                ログアウト
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/auth')}
                            style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.5)', background: 'transparent', color: 'rgba(255,215,0,0.8)', cursor: 'pointer' }}
                        >
                            ログイン
                        </button>
                    )}
                </div>

                <h1 className="title main-title">
                    Pocket Jiminy
                </h1>
                <p className="subtitle home-subtitle">
                    夢を開いて、心の赴くままに
                </p>

                <div className="grid-buttons home-grid">
                    {/* Quiz Tool Card */}
                    <div
                        className="home-btn quiz-btn"
                        onClick={() => navigate('/quiz')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="btn-icon">🏆</div>
                        <div className="btn-content">
                            <h3 className="btn-title">クイズ</h3>
                            <p className="btn-desc">
                                ディズニー知識を試そう！<br/>
                                1人でも友達との対戦も！
                            </p>
                        </div>
                        <div className="play-tag">
                            PLAY QUIZ
                        </div>
                    </div>

                    {/* Attraction Roulette Card */}
                    <div
                        className="home-btn roulette-btn"
                        onClick={() => navigate('/roulette')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="btn-icon">🎡</div>
                        <div className="btn-content">
                            <h3 className="btn-title">ルーレット</h3>
                            <p className="btn-desc">
                                「次はどこ行く？」<br/>
                                迷った時のコンパス。
                            </p>
                        </div>
                        <div className="play-tag" style={{background: 'linear-gradient(135deg, #ff4081, #c2185b)', boxShadow: '0 5px 15px rgba(255, 64, 129, 0.45)'}}>
                            SPIN ROULETTE
                        </div>
                    </div>

                    {/* Plan Card */}
                    <div
                        className="home-btn plan-btn"
                        onClick={() => navigate('/plan')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="btn-icon">🗓️</div>
                        <div className="btn-content">
                            <h3 className="btn-title">プラン作成</h3>
                            <p className="btn-desc">
                                誰と・何人で・ペースは？<br/>
                                あなただけの当日プラン！
                            </p>
                        </div>
                        <div className="play-tag" style={{background: 'linear-gradient(135deg, #00bcd4, #0097a7)', boxShadow: '0 5px 15px rgba(0, 188, 212, 0.45)'}}>
                            CREATE PLAN
                        </div>
                    </div>
                </div>

                <footer className="home-footer">
                    <p>Designed for Disney Fans &nbsp;·&nbsp; © 2026 D-Fan World</p>
                </footer>
            </div>
    );
};

export default HomePage;
