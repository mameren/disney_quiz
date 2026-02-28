import React, { useState, useEffect, useRef } from 'react';

const TypewriterQuestion = ({ text, onComplete, freeze }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Reset state for new text
        const initialChar = text ? text.charAt(0) : '';
        setDisplayedText(initialChar);
        setIsTyping(true);

        let i = 1;
        let currentStr = initialChar;

        // If text is empty or single char, complete immediately
        if (!text || text.length <= 1) {
            setIsTyping(false);
            if (onComplete) onComplete();
            return;
        }

        intervalRef.current = setInterval(() => {
            if (i < text.length) {
                currentStr += text.charAt(i);
                setDisplayedText(currentStr);
                i++;
            } else {
                clearInterval(intervalRef.current);
                setIsTyping(false);
                if (onComplete) onComplete();
            }
        }, 200); // 200ms speed

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text]);

    // Freeze mid-sentence when someone buzzes in (don't complete, don't call onComplete)
    useEffect(() => {
        if (freeze && intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsTyping(false);
        }
    }, [freeze]);

    const handleSkip = () => {
        if (isTyping) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setDisplayedText(text);
            setIsTyping(false);
            if (onComplete) onComplete();
        }
    };

    return (
        <div 
            onClick={handleSkip} 
            style={{ cursor: isTyping ? 'pointer' : 'default', minHeight: '3.6rem' }} 
        >
            <h2 className="question-text">
                {displayedText}
                {isTyping && <span className="cursor-blink">|</span>}
            </h2>
        </div>
    );
};

export default TypewriterQuestion;
