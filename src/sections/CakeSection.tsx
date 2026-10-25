import React, { useState } from 'react';
import { Sparkles, Wind, Flame, RotateCcw, Heart } from 'lucide-react';

interface CakeSectionProps {
  onCelebrate: () => void;
}

export const CakeSection: React.FC<CakeSectionProps> = ({ onCelebrate }) => {
  // Candles state: 5 candles on top of the cake
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [isBlown, setIsBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const allLit = candlesLit.every(Boolean);
  const noneLit = candlesLit.every((c) => !c);

  const toggleCandle = (index: number) => {
    if (isBlown) return;
    const updated = [...candlesLit];
    updated[index] = !updated[index];
    setCandlesLit(updated);
  };

  const lightAll = () => {
    setCandlesLit([true, true, true, true, true]);
    setIsBlown(false);
  };

  const handleBlowCandles = () => {
    setIsBlown(true);
    setCandlesLit([false, false, false, false, false]);
    setWishMade(true);
    onCelebrate(); // Triggers global confetti
  };

  const handleReset = () => {
    setCandlesLit([true, true, true, true, true]);
    setIsBlown(false);
    setWishMade(false);
  };

  return (
    <section id="cake" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Heading */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BD83]/30 bg-[#D9BD83]/10 px-4 py-1 text-xs font-medium text-[#D9BD83] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Birthday Cake</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
          Make a Wish & Blow The Candles
        </h2>
        <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-lg mx-auto mb-8 font-light">
          Tap on each candle to light or blow them, make a silent wish in your heart, aur celebration shuru karo!
        </p>

        {/* The Cake Showcase Box */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* Cake SVG Illustration */}
          <div className="relative flex flex-col items-center justify-center my-4">
            <svg
              viewBox="0 0 340 260"
              className="w-72 sm:w-88 h-auto drop-shadow-2xl select-none"
              aria-label="Interactive Birthday Cake illustration"
            >
              <defs>
                <linearGradient id="tier1Grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#DCD3FA" />
                  <stop offset="100%" stopColor="#BDB0EE" />
                </linearGradient>
                <linearGradient id="tier2Grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F6C8D5" />
                  <stop offset="100%" stopColor="#E2A7B8" />
                </linearGradient>
                <linearGradient id="tier3Grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF8F0" />
                  <stop offset="100%" stopColor="#EFE5D8" />
                </linearGradient>
                <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D9BD83" />
                  <stop offset="100%" stopColor="#B39352" />
                </linearGradient>
                <filter id="flameGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Cake Stand / Plate */}
              <ellipse cx="170" cy="235" rx="145" ry="18" fill="url(#plateGrad)" opacity="0.9" />
              <ellipse cx="170" cy="231" rx="135" ry="14" fill="#FFF8F0" opacity="0.4" />

              {/* Bottom Tier (Lavender) */}
              <path
                d="M 60 170 C 60 155 75 145 170 145 C 265 145 280 155 280 170 L 280 215 C 280 230 265 235 170 235 C 75 235 60 230 60 215 Z"
                fill="url(#tier1Grad)"
              />
              {/* Frosting drips on bottom tier */}
              <path
                d="M 60 175 Q 85 195 110 175 Q 135 195 160 175 Q 185 195 210 175 Q 235 195 260 175 Q 275 185 280 175"
                fill="none"
                stroke="#FFF8F0"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Middle Tier (Blush Pink) */}
              <path
                d="M 85 115 C 85 105 105 95 170 95 C 235 95 255 105 255 115 L 255 155 C 255 165 235 175 170 175 C 105 175 85 165 85 155 Z"
                fill="url(#tier2Grad)"
              />
              <path
                d="M 85 120 Q 110 138 135 120 Q 160 138 185 120 Q 210 138 235 120 Q 248 130 255 120"
                fill="none"
                stroke="#FFF8F0"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Top Tier (Warm Ivory) */}
              <path
                d="M 115 65 C 115 58 135 50 170 50 C 205 50 225 58 225 65 L 225 102 C 225 110 205 118 170 118 C 135 118 115 110 115 102 Z"
                fill="url(#tier3Grad)"
              />
              <path
                d="M 115 72 Q 135 84 155 72 Q 175 84 195 72 Q 215 84 225 72"
                fill="none"
                stroke="#D88BA5"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Strawberry and Golden Pearls Decor */}
              <circle cx="130" cy="98" r="4" fill="#D9BD83" />
              <circle cx="150" cy="102" r="4" fill="#D9BD83" />
              <circle cx="170" cy="104" r="4" fill="#D9BD83" />
              <circle cx="190" cy="102" r="4" fill="#D9BD83" />
              <circle cx="210" cy="98" r="4" fill="#D9BD83" />

              {/* 5 Birthday Candles */}
              {[128, 148, 170, 192, 212].map((x, idx) => {
                const lit = candlesLit[idx];
                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => toggleCandle(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Candle ${idx + 1}: ${lit ? 'lit' : 'extinguished'}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCandle(idx);
                      }
                    }}
                  >
                    {/* Candle Stick with Gold Striping */}
                    <rect x={x - 3} y="32" width="6" height="24" rx="2" fill="#FFF8F0" />
                    <line x1={x - 3} y1="38" x2={x + 3} y2="40" stroke="#D88BA5" strokeWidth="1.5" />
                    <line x1={x - 3} y1="46" x2={x + 3} y2="48" stroke="#D9BD83" strokeWidth="1.5" />

                    {/* Wick */}
                    <line x1={x} y1="32" x2={x} y2="26" stroke="#4B5563" strokeWidth="1.5" />

                    {/* Flame (if lit) */}
                    {lit && (
                      <g filter="url(#flameGlow)" className="animate-pulse">
                        {/* Outer Glow */}
                        <path
                          d={`M ${x} 10 C ${x - 5} 17 ${x - 4} 24 ${x} 26 C ${x + 4} 24 ${x + 5} 17 ${x} 10 Z`}
                          fill="#F59E0B"
                        />
                        {/* Inner Hot Core */}
                        <path
                          d={`M ${x} 14 C ${x - 2.5} 18 ${x - 2} 24 ${x} 25 C ${x + 2} 24 ${x + 2.5} 18 ${x} 14 Z`}
                          fill="#FEF08A"
                        />
                      </g>
                    )}

                    {/* Smoke Puff when blown */}
                    {!lit && isBlown && (
                      <g className="animate-fadeIn opacity-50">
                        <circle cx={x} cy="20" r="3" fill="#DCD3FA" opacity="0.6" />
                        <circle cx={x + (idx % 2 === 0 ? 3 : -3)} cy="14" r="4" fill="#DCD3FA" opacity="0.4" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interaction Status Message */}
          <div className="mt-4 min-h-[4rem] flex flex-col items-center justify-center">
            {wishMade ? (
              <div className="animate-fadeIn">
                <span className="text-xl sm:text-2xl font-serif text-[#D9BD83] font-semibold block mb-1">
                  ✨ Wish Made! May it all come true for Lalee! ✨
                </span>
                <p className="text-xs sm:text-sm text-[#FFF8F0]/80">
                  Teri saari dreams, health aur khushiyan is saal multiply ho jayein!
                </p>
              </div>
            ) : allLit ? (
              <div>
                <span className="text-sm sm:text-base text-[#F6C8D5] font-medium block">
                  All 5 Candles Are Burning Brightly 🕯️
                </span>
                <p className="text-xs text-[#FFF8F0]/60">
                  Click on any candle to toggle, or click "Make a Wish & Blow Candles" below!
                </p>
              </div>
            ) : noneLit ? (
              <span className="text-sm sm:text-base text-[#DCD3FA] font-medium">
                All candles are currently out. Light them to make another wish!
              </span>
            ) : (
              <span className="text-sm text-[#FFF8F0]/80">
                {candlesLit.filter(Boolean).length} of 5 candles lit. Tap individual candles to light them all!
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {allLit && !isBlown && (
              <button
                onClick={handleBlowCandles}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] font-semibold text-sm shadow-lg shadow-[#D88BA5]/25 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                <Wind className="h-4 w-4" />
                <span>Make a Wish & Blow Candles</span>
              </button>
            )}

            {!allLit && (
              <button
                onClick={lightAll}
                className="px-5 py-2.5 rounded-full bg-[#D9BD83]/20 hover:bg-[#D9BD83]/30 border border-[#D9BD83]/40 text-[#D9BD83] font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Light All Candles</span>
              </button>
            )}

            {isBlown && (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[#FFF8F0] font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Celebrate Again</span>
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#FFF8F0]/40">
            <Heart className="h-3 w-3 text-rose-300" />
            <span>Interactive touch & keyboard accessible • No paid animation libraries</span>
          </div>
        </div>
      </div>
    </section>
  );
};
