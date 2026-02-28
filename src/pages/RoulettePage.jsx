
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilities } from '../data/facilities';

const RoulettePage = () => {
    const navigate = useNavigate();
    const [park, setPark] = useState('both'); // 'land', 'sea', 'both'
    const [type, setType] = useState('attraction'); // 'attraction', 'restaurant', 'both'
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [selectedWaitTimes, setSelectedWaitTimes] = useState(['short', 'medium', 'long']);
    
    // Restaurant Filters
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([1, 2, 3]);
    const [prioritySeatingOnly, setPrioritySeatingOnly] = useState(false);

    const [isSpinning, setIsSpinning] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState(null);
    const [result, setResult] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Helper to get current dataset based on type
    const getCurrentDataset = () => {
        if (type === 'both') {
            return facilities;
        }
        return facilities.filter(item => item.type === type);
    };

    // Extract unique areas based on park and type selection
    const getAvailableAreas = () => {
        let filtered = getCurrentDataset();
        if (park !== 'both') filtered = filtered.filter(a => a.park === park);
        
        const areas = [...new Set(filtered.map(a => a.area))];
        return areas.sort();
    };

    // Reset area selection when park or type changes
    useEffect(() => {
        setSelectedAreas([]);
    }, [park, type]);

    // Toggle area selection
    const toggleArea = (area) => {
        if (selectedAreas.includes(area)) {
            setSelectedAreas(selectedAreas.filter(a => a !== area));
        } else {
            setSelectedAreas([...selectedAreas, area]);
        }
    };

    // Toggle wait time selection
    const toggleWaitTime = (time) => {
        if (selectedWaitTimes.includes(time)) {
            setSelectedWaitTimes(selectedWaitTimes.filter(t => t !== time));
        } else {
            setSelectedWaitTimes([...selectedWaitTimes, time]);
        }
    };

    // Toggle Price Range
    const togglePriceRange = (range) => {
        if (selectedPriceRanges.includes(range)) {
            setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
        } else {
            setSelectedPriceRanges([...selectedPriceRanges, range]);
        }
    };

    // Filter attractions logic
    const getFilteredAttractions = () => {
        let candidates = getCurrentDataset();

        // 1. Filter by Park
        if (park !== 'both') {
            candidates = candidates.filter(a => a.park === park);
        }

        // 2. Filter by Area (if any selected)
        if (selectedAreas.length > 0) {
            candidates = candidates.filter(a => selectedAreas.includes(a.area));
        }

        // 3. Filter by Wait Time
        candidates = candidates.filter(a => selectedWaitTimes.includes(a.waitTime));

        // 4. Filter by Restaurant Specifics (Price & Priority Seating)
        // These filters only apply to items of type 'restaurant'
        candidates = candidates.filter(item => {
            if (item.type !== 'restaurant') return true; // Pass through non-restaurants

            // Price Filter
            if (item.priceRange && !selectedPriceRanges.includes(item.priceRange)) {
                return false;
            }

            // Priority Seating Filter
            if (prioritySeatingOnly && !item.prioritySeating) {
                return false;
            }

            return true;
        });

        return candidates;
    };

    const handleSpin = () => {
        if (isSpinning) return;
        
        const candidates = getFilteredAttractions();
        
        if (candidates.length === 0) {
            alert('条件に合う施設がありません。フィルターを調整してください。');
            return;
        }

        setIsSpinning(true);
        setResult(null);

        let count = 0;
        const maxCount = 40; // Slightly longer spin for anticipation
        const speed = 80;

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            setCurrentAttraction(candidates[randomIndex]);
            count++;

            if (count >= maxCount) {
                clearInterval(interval);
                setIsSpinning(false);
                const finalIndex = Math.floor(Math.random() * candidates.length);
                const finalResult = candidates[finalIndex];
                setCurrentAttraction(finalResult);
                setResult(finalResult);
            }
        }, speed);
    };

    const waitTimeLabels = {
        short: '🐰 すいすい (~30m)',
        medium: '🐻 まあまあ (30-60m)',
        long: '🐢 じっくり (60m~)'
    };
    
    // Dataset Type Labels
    const typeLabels = {
        attraction: '🎢 アトラクション',
        restaurant: '🍽️ レストラン',
        both: '✨ どっちも'
    };

    const priceLabels = {
        1: '💰 お手頃 (~¥1,500)',
        2: '💰💰 標準 (¥1,500~)',
        3: '💎 リッチ (¥3,000~)'
    };
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
        }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '30px', border: '2px solid rgba(255,255,255,0.5)' }}>
                <h1 className="title cute-text-shadow" style={{ fontSize: '2.2rem', marginBottom: '25px' }}>
                    🎡 Happiness Roulette ✨
                </h1>

                {/* Park Selection - TICKET STYLE */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <button 
                        className={`ticket-btn ${park === 'land' ? 'selected' : ''}`}
                        onClick={() => setPark('land')}
                        style={{ padding: '12px 25px' }}
                    >
                        <span>🏰 LAND</span>
                    </button>
                    <button 
                        className={`ticket-btn sea-theme ${park === 'sea' ? 'selected' : ''}`}
                        onClick={() => setPark('sea')}
                        style={{ padding: '12px 25px' }}
                    >
                        <span>🌋 SEA</span>
                    </button>
                    <button 
                        className={`ticket-btn both-theme ${park === 'both' ? 'selected' : ''}`}
                        onClick={() => setPark('both')}
                        style={{ padding: '12px 25px' }}
                    >
                        <span>✨ BOTH</span>
                    </button>
                </div>

                {/* Category Selection - Top Level */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                    {['attraction', 'restaurant', 'both'].map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`filter-chip ${type === t ? 'active' : ''}`}
                            style={{ padding: '8px 20px', fontSize: '1rem' }}
                        >
                            {typeLabels[t]}
                        </button>
                    ))}
                </div>

                {/* Filter Toggle */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        marginBottom: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                >
                    {showFilters ? '🔽 閉じる' : '⚙️ こだわり設定'}
                </button>

                {/* Filters Section */}
                {showFilters && (
                    <div className="magic-card" style={{
                        padding: '20px',
                        marginBottom: '25px',
                        textAlign: 'left',
                        animation: 'popIn 0.3s ease'
                    }}>
                        
                        {/* Restaurant Filters - Show only if Restaurant or Both is selected */}
                        {(type === 'restaurant' || type === 'both') && (
                            <>
                                {/* Price Range Filter */}
                                <div style={{ marginBottom: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.9 }}>💴 予算</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {[1, 2, 3].map(range => (
                                            <div 
                                                key={range} 
                                                onClick={() => togglePriceRange(range)}
                                                className={`filter-chip ${selectedPriceRanges.includes(range) ? 'active' : ''}`}
                                            >
                                                {priceLabels[range]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority Seating Filter */}
                                <div style={{ marginBottom: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.9 }}>📅 予約・受付</h4>
                                    <div 
                                        onClick={() => setPrioritySeatingOnly(!prioritySeatingOnly)}
                                        className={`filter-chip ${prioritySeatingOnly ? 'active' : ''}`}
                                    >
                                        Priority Seating 対象のみ
                                    </div>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '15px 0' }} />
                            </>
                        )}

                        {/* Wait Time Filter */}
                        <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.9 }}>⏳ 待ち時間</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {['short', 'medium', 'long'].map(time => (
                                    <div 
                                        key={time} 
                                        onClick={() => toggleWaitTime(time)}
                                        className={`filter-chip ${selectedWaitTimes.includes(time) ? 'active' : ''}`}
                                    >
                                        {waitTimeLabels[time]}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.9 }}>🗺️ エリア</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {getAvailableAreas().map(area => (
                                    <div
                                        key={area}
                                        onClick={() => toggleArea(area)}
                                        className={`filter-chip ${selectedAreas.includes(area) ? 'active' : ''}`}
                                    >
                                        {area}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Display Area - SPIN DISPLAY */}
                <div className={`spin-display ${isSpinning ? 'active' : ''} ${result ? 'result' : ''}`}>
                    {currentAttraction ? (
                        <>
                            <div style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.3)', position: 'absolute', top: '60px' }}>
                                <span style={{ marginRight: '5px' }}>{currentAttraction.park === 'land' ? '🏰' : '🌋'}</span>
                                {currentAttraction.area}
                            </div>
                            <div style={{ 
                                fontSize: '1.8rem', 
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                                padding: '0 20px',
                                lineHeight: '1.3',
                                animation: result ? 'float 3s ease-in-out infinite' : 'none'
                            }}>
                                {currentAttraction.name}
                            </div>
                            <div style={{ position: 'absolute', bottom: '50px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '15px' }}>
                                {waitTimeLabels[currentAttraction.waitTime].split(' ')[0]}
                            </div>
                        </>
                    ) : (
                        <div style={{ opacity: 0.8, fontSize: '1.2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎪</div>
                            Let's Go!
                        </div>
                    )}
                </div>

                {/* Control Buttons */}
                <button 
                    className={`action-btn-large ${isSpinning ? 'spinning' : ''}`}
                    onClick={handleSpin}
                    disabled={isSpinning}
                >
                    {isSpinning ? 'SPINNING...' : '🎰 START!'}
                </button>

                <div style={{ marginTop: '20px' }}>
                    <button 
                        className="option-btn"
                        onClick={() => navigate('/')}
                        style={{ padding: '10px 30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '25px', fontSize: '0.9rem' }}
                    >
                        ↩️ Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoulettePage;
