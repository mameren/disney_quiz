import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilities } from '../data/facilities';

// ─── Constants ────────────────────────────────────────────────────────────────

const GROUP_TYPES = [
  { id: 'solo',          label: '1人旅',     icon: '🧑',     desc: 'マイペースで自由に！' },
  { id: 'couple',        label: 'カップル',   icon: '💑',     desc: 'ロマンチックに♥' },
  { id: 'friends',       label: '友達グループ', icon: '🎉',   desc: 'みんなで盛り上がろう！' },
  { id: 'family_kids',   label: '子連れ家族', icon: '👨‍👩‍👧',  desc: 'お子様も一緒に！' },
  { id: 'family_adults', label: '大人家族',   icon: '👨‍👩‍👦‍👦', desc: 'のんびり家族旅行' },
];

const GROUP_SIZES = [
  { id: 'small',  label: '1〜2人', icon: '👤' },
  { id: 'medium', label: '3〜5人', icon: '👥' },
  { id: 'large',  label: '6人以上', icon: '👨‍👩‍👧‍👦' },
];

const PARKS = [
  { id: 'land', label: 'ランド', icon: '🏰' },
  { id: 'sea',  label: 'シー',   icon: '🌋' },
];

const PURPOSES = [
  { id: 'attractions', label: 'アトラクション重視', icon: '🎢', desc: 'とにかく乗り物！' },
  { id: 'gourmet',     label: 'グルメ重視',         icon: '🍽️', desc: '食べ歩き・レストラン' },
  { id: 'shows',       label: 'ショー・パレード',    icon: '🎭', desc: '見て楽しむ！' },
  { id: 'relaxed',     label: 'ゆったり観光',        icon: '🌸', desc: '写真・散策中心' },
  { id: 'balanced',    label: 'バランス型',          icon: '⚖️', desc: '何でも楽しみたい！' },
];

const PACES = [
  { id: 'active', label: '歩き回れる', icon: '👟', desc: 'どこでもOK！フル稼働' },
  { id: 'normal', label: '普通',       icon: '🚶', desc: '適度に休みつつ' },
  { id: 'slow',   label: 'ゆっくりめ', icon: '👠', desc: '疲れにくいプランで' },
];

const DURATIONS = [
  { id: 'half', label: '半日', icon: '⏱️', desc: '約5時間（朝〜昼）' },
  { id: 'full', label: '1日', icon: '🌞', desc: '開園〜閉園まで！' },
];

const STEP_LABELS = ['グループ', '人数&パーク', '目的', 'ペース', '時間'];

// ─── Plan Generation ──────────────────────────────────────────────────────────

const THRILL_IDS = new Set([
  'tdl_1', 'tdl_2', 'tdl_3',             // Big Thunder / Splash / Space Mountain
  'tds_2', 'tds_4', 'tds_5', 'tds_6',   // Tower of Terror / Center of Earth / Indy / Raging Spirits
]);

const AREA_ORDER = {
  land: ['ワールドバザール', 'アドベンチャーランド', 'ウエスタンランド', 'クリッターカントリー', 'ファンタジーランド', 'トゥーンタウン', 'トゥモローランド'],
  sea:  ['メディテレーニアンハーバー', 'ファンタジースプリングス', 'アメリカンウォーターフロント', 'ポートディスカバリー', 'ロストリバーデルタ', 'アラビアンコースト', 'マーメイドラグーン', 'ミステリアスアイランド'],
};

const KID_FRIENDLY_AREAS = {
  land: ['ファンタジーランド', 'トゥーンタウン', 'アドベンチャーランド'],
  sea:  ['マーメイドラグーン', 'アラビアンコースト', 'ファンタジースプリングス'],
};

const ROMANTIC_AREAS = {
  land: ['ファンタジーランド'],
  sea:  ['ファンタジースプリングス', 'アラビアンコースト', 'メディテレーニアンハーバー'],
};

const SHOW_IDS = new Set(['tdl_24', 'tdl_25', 'tdl_28', 'tdl_29', 'tds_9', 'tds_11', 'tds_12']);

function generatePlan({ groupType, park, purpose, pace, duration }) {
  let attractions = facilities.filter(f => f.type === 'attraction' && f.park === park);
  const restaurants = facilities.filter(f => f.type === 'restaurant' && f.park === park);

  if (pace === 'slow') attractions = attractions.filter(a => a.waitTime !== 'long');
  if (groupType === 'family_kids') attractions = attractions.filter(a => !THRILL_IDS.has(a.id));

  const areaOrderArr = AREA_ORDER[park] || [];

  const scored = attractions.map(a => {
    let score = a.waitTime === 'long' ? 10 : a.waitTime === 'medium' ? 5 : 2;
    if (groupType === 'family_kids' && (KID_FRIENDLY_AREAS[park] || []).includes(a.area)) score += 5;
    if (groupType === 'couple'      && (ROMANTIC_AREAS[park] || []).includes(a.area))     score += 3;
    if (purpose === 'shows'   && SHOW_IDS.has(a.id))  score += 8;
    if (purpose === 'relaxed' && a.waitTime === 'short') score += 5;
    if (purpose === 'relaxed' && a.waitTime === 'long')  score -= 4;
    if (purpose === 'gourmet') score -= 2;
    const idx = areaOrderArr.indexOf(a.area);
    if (idx !== -1) score += (areaOrderArr.length - idx) * 0.2;
    return { ...a, score };
  }).sort((a, b) => b.score - a.score);

  const headliners = scored.filter(a => a.waitTime === 'long');
  const regular    = scored.filter(a => a.waitTime === 'medium');
  const casual     = scored.filter(a => a.waitTime === 'short');

  // Pick unique items
  const usedAttrIds = new Set();
  const pickAttr = (...pools) => {
    for (const pool of pools) {
      for (const c of pool) {
        if (!usedAttrIds.has(c.id)) { usedAttrIds.add(c.id); return c; }
      }
    }
    return null;
  };

  const usedRestIds = new Set();
  const pickRest = (pool) => {
    for (const r of pool) {
      if (!usedRestIds.has(r.id)) { usedRestIds.add(r.id); return r; }
    }
    return null;
  };

  let lunchRest, dinnerRest;
  if (purpose === 'gourmet') {
    const ps      = [...restaurants.filter(r => r.prioritySeating)].sort(() => Math.random() - 0.5);
    const all     = [...restaurants].sort(() => Math.random() - 0.5);
    lunchRest  = pickRest(ps.length ? ps : all);
    dinnerRest = pickRest(all);
  } else {
    const shuffled = [...restaurants].sort(() => Math.random() - 0.5);
    lunchRest  = pickRest(shuffled);
    dinnerRest = pickRest(shuffled);
  }

  const isHalfDay = duration === 'half';
  const slots = [];
  const addSec = (label, sublabel = '') => slots.push({ type: 'section', label, sublabel });
  const addA   = (time, tip, ...pools) => {
    const item = pickAttr(...pools);
    if (item) slots.push({ type: 'attraction', item, time, tip });
  };
  const addR   = (item, time) => { if (item) slots.push({ type: 'restaurant', item, time }); };

  addSec('🌅 開園〜10:00', '朝イチ勝負！人が少ないうちに！');
  addA('09:00', '開園と同時にダッシュ！', headliners, regular, casual);
  addA('09:45', '続けてこちらへ！',       headliners, regular, casual);

  addSec('🎢 午前中 (10:00〜12:00)');
  addA('10:30', '', regular, headliners, casual);
  addA('11:15', '', headliners, regular, casual);

  addSec('🍽️ ランチ (12:00〜13:30)');
  addR(lunchRest, '12:00');

  if (!isHalfDay) {
    addSec('🎡 午後 (13:30〜17:00)');
    addA('13:30', '',              headliners, regular, casual);
    addA('14:30', '',              regular, headliners, casual);
    addA('15:30', '',              regular, casual, headliners);
    addA('16:30', '夕方前にもう1個！', casual, regular, headliners);

    addSec('🍴 ディナー (17:30〜19:00)');
    addR(dinnerRest, '17:30');

    addSec('🌙 夜 (19:00〜閉園)', '夜のパークも最高！');
    addA('19:00', '',                   casual, regular, headliners);
    addA('20:00', '最後の夜を楽しもう！', regular, casual, headliners);
  }

  // Tips
  const tips = [];
  if      (groupType === 'family_kids')   { tips.push({ icon: '👶', text: '身長制限があるアトラクションは事前に確認しよう！' }); tips.push({ icon: '🎪', text: 'キャラクターグリーティングは子供に大人気！ミッキーに会いに行こう' }); }
  else if (groupType === 'couple')         { tips.push({ icon: park === 'sea' ? '🌹' : '🏰', text: park === 'sea' ? 'ファンタジースプリングスは夕暮れ時がロマンチック！' : 'シンデレラ城の前は最高のフォトスポット！夜のライトアップも素敵' }); tips.push({ icon: '💕', text: 'Priority Seatのレストランは事前予約で特別な体験に♥' }); }
  else if (groupType === 'solo')           { tips.push({ icon: '🎯', text: '1人旅は身軽！一列シートで待ち時間短縮できるアトラクションも多いよ' }); tips.push({ icon: '📸', text: 'キャストさんと話すのも旅の醍醐味。ゆっくり楽しもう！' }); }
  else if (groupType === 'friends')        { tips.push({ icon: '🎉', text: '人数によっては乗れないアトラクションも。乗車制限を事前チェック！' }); tips.push({ icon: '🍡', text: '食べ歩きスナックをみんなでシェアするのが楽しい！' }); }
  else if (groupType === 'family_adults')  { tips.push({ icon: '🌸', text: 'のんびり散策しながら写真撮影も旅の醍醐味' }); tips.push({ icon: '🎭', text: 'ショーやパレードは座って楽しめて疲れにくくておすすめ' }); }

  if      (purpose === 'gourmet') tips.push({ icon: '🍴', text: 'Priority Seatは開園直後にアプリから予約！人気店はすぐ埋まります' });
  else if (purpose === 'shows')   tips.push({ icon: '🎭', text: 'ショー・パレードのスケジュールはアプリで確認！30分前から場所確保' });
  else if (purpose === 'relaxed') tips.push({ icon: '☕', text: 'カフェで一息つく時間も旅の醍醐味。焦らずのんびり！' });

  tips.push({ icon: '📱', text: '公式アプリで待ち時間をリアルタイムチェック！これは必須ツール' });

  return { slots, tips: tips.slice(0, 4) };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priceLabel  = (n) => n === 1 ? '💰' : n === 2 ? '💰💰' : '💎';
const waitLabel   = (w) => w === 'long' ? '待ち多め' : w === 'medium' ? '待ち普通' : '待ち少';
const waitColor   = (w) => w === 'long' ? '#ff8a80' : w === 'medium' ? '#ffd54f' : '#69f0ae';

const findLabel = (arr, id) => arr.find(x => x.id === id);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepProgress = ({ current, total }) => (
  <div className="plan-steps">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div className={`plan-step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
          {i < current ? '✓' : i + 1}
        </div>
        {i < total - 1 && <div className={`plan-step-line ${i < current ? 'done' : ''}`} />}
      </React.Fragment>
    ))}
  </div>
);

const OptionCard = ({ item, selected, onClick, wide }) => (
  <div
    className={`plan-option-card ${selected ? 'selected' : ''} ${wide ? 'wide' : ''}`}
    onClick={() => onClick(item.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick(item.id)}
  >
    <span className="plan-option-icon">{item.icon}</span>
    <div className="plan-option-text">
      <span className="plan-option-label">{item.label}</span>
      {item.desc && <span className="plan-option-desc">{item.desc}</span>}
    </div>
  </div>
);

const StepScreen = ({ title, subtitle, items, selected, onSelect, cols }) => (
  <>
    <h2 className="title plan-step-title">{title}</h2>
    {subtitle && <p className="subtitle" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>{subtitle}</p>}
    <div className={`plan-option-grid ${cols === 2 ? 'cols-2' : ''}`}>
      {items.map(item => (
        <OptionCard key={item.id} item={item} selected={selected === item.id} onClick={onSelect} />
      ))}
    </div>
  </>
);

// ─── Result Screen ────────────────────────────────────────────────────────────

const PlanResultScreen = ({ plan, inputs, onReset, onHome }) => {
  const { slots, tips } = plan;

  return (
    <div className="app-container" style={{ paddingTop: 'clamp(12px, 3vh, 40px)', paddingBottom: '30px' }}>
      <div className="glass-card plan-card">
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '8px' }}>📅 あなたのプラン</h2>

        {/* Summary badges */}
        <div className="plan-badges">
          <span className="plan-badge">{findLabel(GROUP_TYPES, inputs.groupType)?.icon} {findLabel(GROUP_TYPES, inputs.groupType)?.label}</span>
          <span className="plan-badge">{findLabel(GROUP_SIZES, inputs.groupSize)?.label}</span>
          <span className="plan-badge">{inputs.park === 'land' ? '🏰' : '🌋'} {findLabel(PARKS, inputs.park)?.label}</span>
          <span className="plan-badge">{findLabel(PURPOSES, inputs.purpose)?.icon} {findLabel(PURPOSES, inputs.purpose)?.label}</span>
          <span className="plan-badge">{findLabel(PACES, inputs.pace)?.icon}</span>
          <span className="plan-badge">{findLabel(DURATIONS, inputs.duration)?.label}</span>
        </div>

        {/* Timeline */}
        <div className="plan-timeline">
          {slots.map((slot, i) => {
            if (slot.type === 'section') {
              return (
                <div key={i} className="plan-section-header">
                  <span className="plan-section-label">{slot.label}</span>
                  {slot.sublabel && <span className="plan-section-sub">{slot.sublabel}</span>}
                </div>
              );
            }
            if (slot.type === 'attraction') {
              return (
                <div key={i} className="plan-item">
                  <div className="plan-item-time">{slot.time}</div>
                  <div className="plan-item-body">
                    <div className="plan-item-name">🎢 {slot.item.name}</div>
                    <div className="plan-item-meta">
                      <span className="plan-meta-tag">📍 {slot.item.area}</span>
                      <span className="plan-meta-tag plan-wait-tag" style={{ color: waitColor(slot.item.waitTime) }}>
                        ⏱️ {waitLabel(slot.item.waitTime)}
                      </span>
                    </div>
                    {slot.tip && <div className="plan-item-tip">💡 {slot.tip}</div>}
                  </div>
                </div>
              );
            }
            if (slot.type === 'restaurant') {
              return (
                <div key={i} className="plan-item plan-item-rest">
                  <div className="plan-item-time">{slot.time}</div>
                  <div className="plan-item-body">
                    <div className="plan-item-name">🍽️ {slot.item.name}</div>
                    <div className="plan-item-meta">
                      <span className="plan-meta-tag">📍 {slot.item.area}</span>
                      <span className="plan-meta-tag">{priceLabel(slot.item.priceRange)}</span>
                      {slot.item.prioritySeating && <span className="plan-meta-tag plan-ps-tag">📅 Priority Seat対象</span>}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Tips */}
        <div className="plan-tips-container">
          <h3 className="plan-tips-title">💡 あなたへのアドバイス</h3>
          <div className="plan-tips">
            {tips.map((tip, i) => (
              <div key={i} className="plan-tip-item">
                <span className="plan-tip-icon">{tip.icon}</span>
                <span className="plan-tip-text">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
          <button className="start-btn" onClick={onReset} style={{ flex: 1, fontSize: '1rem', padding: '15px', minWidth: '140px' }}>
            🔄 もう一度作る
          </button>
          <button onClick={onHome} className="option-btn" style={{ flex: 1, padding: '15px', fontSize: '1rem', minWidth: '140px' }}>
            🏠 ホームへ
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

function PlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({
    groupType: null,
    groupSize: null,
    park: null,
    purpose: null,
    pace: null,
    duration: null,
  });
  const [plan, setPlan] = useState(null);

  const update = (key, val) => setInputs(prev => ({ ...prev, [key]: val }));

  const canNext = () => {
    if (step === 1) return !!inputs.groupType;
    if (step === 2) return !!inputs.groupSize && !!inputs.park;
    if (step === 3) return !!inputs.purpose;
    if (step === 4) return !!inputs.pace;
    if (step === 5) return !!inputs.duration;
    return false;
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      setPlan(generatePlan(inputs));
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate('/');
  };

  const handleReset = () => {
    setStep(1);
    setInputs({ groupType: null, groupSize: null, park: null, purpose: null, pace: null, duration: null });
    setPlan(null);
  };

  if (step === 6 && plan) {
    return <PlanResultScreen plan={plan} inputs={inputs} onReset={handleReset} onHome={() => navigate('/')} />;
  }

  return (
    <div className="app-container" style={{ paddingTop: 'clamp(12px, 3vh, 40px)' }}>
      <div className="glass-card plan-card">

        {/* Header */}
        <div className="plan-header-row">
          <button onClick={handleBack} className="plan-back-btn">← 戻る</button>
          <div className="plan-header-title">プラン作成</div>
          <span className="plan-header-count">{step} / 5</span>
        </div>

        {/* Progress */}
        <StepProgress current={step - 1} total={5} />

        {/* Step label */}
        <p className="plan-step-label-text">{STEP_LABELS[step - 1]}</p>

        {/* Content */}
        <div className="plan-step-content">
          {step === 1 && (
            <StepScreen
              title="誰と行きますか？"
              subtitle="グループの雰囲気に合わせたプランを作ります"
              items={GROUP_TYPES}
              selected={inputs.groupType}
              onSelect={(id) => update('groupType', id)}
            />
          )}

          {step === 2 && (
            <>
              <h2 className="title plan-step-title">人数とパークを選択</h2>
              <div className="selection-group">
                <label className="label">何人で行く？</label>
                <div className="plan-option-grid">
                  {GROUP_SIZES.map(s => (
                    <OptionCard key={s.id} item={s} selected={inputs.groupSize === s.id} onClick={(id) => update('groupSize', id)} />
                  ))}
                </div>
              </div>
              <div className="selection-group">
                <label className="label">どのパーク？</label>
                <div className="plan-option-grid cols-2">
                  {PARKS.map(p => (
                    <OptionCard key={p.id} item={p} selected={inputs.park === p.id} onClick={(id) => update('park', id)} wide />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <StepScreen
              title="何を目的にしてる？"
              subtitle="スタイルに合わせてプランを最適化します"
              items={PURPOSES}
              selected={inputs.purpose}
              onSelect={(id) => update('purpose', id)}
            />
          )}

          {step === 4 && (
            <StepScreen
              title="ペースはどのくらい？"
              subtitle="「何を履いてきた？」が目安です"
              items={PACES}
              selected={inputs.pace}
              onSelect={(id) => update('pace', id)}
            />
          )}

          {step === 5 && (
            <StepScreen
              title="何時間楽しむ？"
              subtitle="滞在時間に合わせたボリュームで作ります"
              items={DURATIONS}
              selected={inputs.duration}
              onSelect={(id) => update('duration', id)}
              cols={2}
            />
          )}
        </div>

        {/* Next button */}
        <button
          className="start-btn"
          disabled={!canNext()}
          style={{ opacity: canNext() ? 1 : 0.35, marginTop: '24px' }}
          onClick={handleNext}
        >
          {step === 5 ? '✨ プランを生成する！' : '次へ →'}
        </button>
      </div>
    </div>
  );
}

export default PlanPage;
