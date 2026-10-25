import React, { useState } from 'react';
import { Gift, Sparkles, RotateCcw, Heart, Star, X } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday';

interface GiftSectionProps {
  config: BirthdayConfig;
  onOpenSurpriseTrigger?: () => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ config, onOpenSurpriseTrigger }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenGift = () => {
    if (isAnimating || isOpened) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsAnimating(false);
      if (onOpenSurpriseTrigger) onOpenSurpriseTrigger();
    }, 600);
  };

  const handleResetGift = () => {
    setIsOpened(false);
  };

  return (
    <section id="gift" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Heading */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F6C8D5]/25 bg-[#F6C8D5]/10 px-4 py-1 text-xs font-medium text-[#F6C8D5] mb-3">
          <Gift className="h-3.5 w-3.5" />
          <span>Surprise Package For Lalee</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
          A Little Box Of Joy
        </h2>
        <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-lg mx-auto mb-10 font-light">
          Ek chhota sa token to celebrate everything that makes you wonderful. Tap to unwrap!
        </p>

        {/* Gift Box Container */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 p-8 sm:p-12 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
          {!isOpened ? (
            /* Unopened Gift Box State */
            <div className="flex flex-col items-center group cursor-pointer" onClick={handleOpenGift}>
              <div
                className={`relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500 ${
                  isAnimating ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                }`}
              >
                {/* Gift Box Lid */}
                <div
                  className={`absolute top-0 left-2 right-2 h-14 bg-gradient-to-r from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] rounded-xl shadow-lg border border-white/30 z-20 transition-all duration-500 ${
                    isAnimating ? '-translate-y-8 -rotate-12 opacity-80' : ''
                  }`}
                >
                  {/* Ribbon Bow on Lid */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full border-4 border-[#D9BD83] bg-[#D9BD83]/40 shadow-md rotate-45" />
                    <div className="absolute w-7 h-7 rounded-full border-4 border-[#D9BD83] bg-[#D9BD83]/50 -rotate-45" />
                  </div>
                  {/* Vertical Ribbon on Lid */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#D9BD83] opacity-90" />
                </div>

                {/* Gift Box Body */}
                <div className="absolute top-11 left-4 right-4 bottom-2 bg-gradient-to-b from-[#D88BA5] via-[#C97B95] to-[#994764] rounded-2xl shadow-2xl border border-white/20 z-10 flex items-center justify-center overflow-hidden">
                  {/* Vertical Ribbon */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#D9BD83] opacity-90 shadow-sm" />
                  {/* Horizontal Ribbon */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-[#D9BD83] opacity-90 shadow-sm" />
                  {/* Sparkle emblem in center */}
                  <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#171A35] text-[#D9BD83] shadow-md">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <span className="font-serif text-xl sm:text-2xl text-[#FFF8F0] font-medium group-hover:text-[#F6C8D5] transition">
                  Tap to Unwrap The Gift 🎁
                </span>
                <span className="text-xs text-[#DCD3FA]/70 mt-1">
                  Specially wrapped for Lalee Patle
                </span>
              </div>
            </div>
          ) : (
            /* Opened Gift Card Reveal */
            <div className="w-full max-w-lg bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E8] to-[#F6C8D5]/40 text-[#171A35] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9BD83]/60 animate-fadeIn relative">
              {/* Close Button */}
              <button
                onClick={handleResetGift}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#171A35]/10 hover:bg-[#171A35]/20 text-[#171A35] transition"
                aria-label="Close surprise card"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-[#D9BD83] text-xs font-semibold uppercase tracking-wider mb-2">
                <Star className="h-4 w-4 fill-current" />
                <span>Special Surprise Card</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171A35] mb-4">
                Dear Lalee, You Are Truly One of a Kind!
              </h3>

              <div className="p-4 rounded-2xl bg-white/70 border border-[#D88BA5]/30 mb-5 text-left">
                <p className="text-sm sm:text-base text-[#171A35]/90 leading-relaxed font-normal mb-3">
                  "Kuch log zindagi mein sirf aate hain, par kuch log aise hote hain jinka hona hi poore mahol ko positive aur calm bana deta hai. Teri friendship ek aisi blessing hai jiske liye main hamesha thankful rahoonga."
                </p>
                <p className="text-xs sm:text-sm text-[#D88BA5] font-medium">
                  — Always wishing the absolute greatest for you, today and every single day ahead.
                </p>
              </div>

              {/* Gift Promises / Best Friend Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-6 text-left">
                <div className="p-2.5 rounded-xl bg-white/50 border border-black/5 flex items-center gap-2">
                  <span className="text-base">☕</span>
                  <span className="font-medium text-[#171A35]/80">Unlimited Chai & Listening Sessions</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/50 border border-black/5 flex items-center gap-2">
                  <span className="text-base">🛡️</span>
                  <span className="font-medium text-[#171A35]/80">Zero Judgement Safe Space</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/50 border border-black/5 flex items-center gap-2">
                  <span className="text-base">🌟</span>
                  <span className="font-medium text-[#171A35]/80">Your Personal Cheerleader Always</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/50 border border-black/5 flex items-center gap-2">
                  <span className="text-base">🍰</span>
                  <span className="font-medium text-[#171A35]/80">Birthday Treat Guaranteed</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#171A35]/15">
                <button
                  onClick={handleResetGift}
                  className="flex items-center gap-1 text-xs font-semibold text-[#D88BA5] hover:text-[#171A35] transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Wrap Box Again</span>
                </button>

                <div className="inline-flex items-center gap-1.5 text-xs text-[#171A35]/60">
                  <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
                  <span>Best Friend Edition</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
