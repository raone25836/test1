import React from 'react';
import { Sparkles, Heart, Gift, ArrowDown, Star, Calendar } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday';
import { CountdownResult } from '../utils/countdown';

interface HeroSectionProps {
  config: BirthdayConfig;
  countdown: CountdownResult;
  onOpenSurprise: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  countdown,
  onOpenSurprise,
  onNavigate,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-28 sm:pb-16 px-4 text-center overflow-hidden"
    >
      {/* Delicate floating background elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-[36rem] w-[36rem] rounded-full border border-[#DCD3FA]/20 animate-spin [animation-duration:90s]" />
        <div className="absolute h-[26rem] w-[26rem] rounded-full border border-[#F6C8D5]/20 animate-spin [animation-duration:60s] [animation-direction:reverse]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BD83]/30 bg-[#171A35]/60 px-4 py-1.5 text-xs font-medium text-[#D9BD83] backdrop-blur-md mb-6 shadow-sm shadow-[#D9BD83]/10">
          <Star className="h-3.5 w-3.5 fill-[#D9BD83] animate-pulse" />
          <span>Celebrating 23 November • Asia/Kolkata</span>
          <span className="hidden sm:inline">• Pure Best-Friend Gift</span>
        </div>

        {/* Main Name & Title */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-[#FFF8F0] mb-4">
          <span className="block italic text-[#F6C8D5] text-3xl sm:text-4xl md:text-5xl font-light mb-2">
            Happy Birthday,
          </span>
          <span className="bg-gradient-to-r from-[#FFF8F0] via-[#F6C8D5] to-[#DCD3FA] bg-clip-text text-transparent font-medium">
            {config.recipientName}
          </span>
        </h1>

        {/* Emotional Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#FFF8F0]/80 font-light leading-relaxed mb-8">
          {config.subheadline}
        </p>

        {/* Countdown Pill Preview */}
        <div className="mb-10 inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 backdrop-blur-md text-xs sm:text-sm text-[#FFF8F0]/90">
          <Calendar className="h-4 w-4 text-[#F6C8D5]" />
          {countdown.isBirthday ? (
            <span className="font-semibold text-rose-300 animate-bounce">
              🎉 Aaj Lalee ka Birthday hai! Happy Birthday!
            </span>
          ) : (
            <span>
              Next Birthday in: <strong className="text-[#D9BD83]">{countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</strong>
            </span>
          )}
        </div>

        {/* Prominent CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenSurprise}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] font-semibold text-base shadow-lg shadow-[#D88BA5]/25 hover:shadow-xl hover:shadow-[#D88BA5]/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Gift className="h-5 w-5 text-[#171A35] group-hover:rotate-12 transition-transform" />
            <span>Open Your Surprise</span>
            <Sparkles className="h-4 w-4 text-[#171A35] animate-pulse" />
          </button>

          <button
            onClick={() => onNavigate('letter')}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[#FFF8F0] font-medium text-base backdrop-blur-md hover:border-[#F6C8D5]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="h-4 w-4 text-[#F6C8D5]" />
            <span>Read Birthday Letter</span>
          </button>
        </div>

        {/* Quick Shortcut Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 text-xs text-[#FFF8F0]/70">
          <button
            onClick={() => onNavigate('cake')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#DCD3FA]/40 hover:text-white transition"
          >
            🎂 Blow Candles
          </button>
          <button
            onClick={() => onNavigate('appreciation')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#DCD3FA]/40 hover:text-white transition"
          >
            🌸 8 Appreciation Cards
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#DCD3FA]/40 hover:text-white transition"
          >
            🖼️ Dreamy Gallery
          </button>
          <button
            onClick={() => onNavigate('wishes')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#DCD3FA]/40 hover:text-white transition"
          >
            💌 Guest Wish Wall
          </button>
        </div>

        {/* Signature */}
        <div className="mt-14 flex items-center gap-2 text-xs text-[#DCD3FA]/60 font-light">
          <span>Made with care for Lalee</span>
          <span>•</span>
          <span className="italic">A digital sanctuary for a wonderful best friend</span>
        </div>

        <button
          onClick={() => onNavigate('countdown')}
          aria-label="Scroll to countdown section"
          className="mt-8 p-2 text-[#FFF8F0]/40 hover:text-[#FFF8F0] transition animate-bounce"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};
