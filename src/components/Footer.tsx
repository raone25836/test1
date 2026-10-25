import React from 'react';
import { Heart, Sparkles, ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-[#F6C8D5]/15 bg-[#121429]/90 backdrop-blur-md pt-12 pb-16 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Floating emblem */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] shadow-lg mb-4">
          <Sparkles className="h-6 w-6" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FFF8F0] mb-2">
          Lalee Patle
        </h3>

        <p className="text-xs sm:text-sm text-[#FFF8F0]/70 max-w-md mb-6 font-light">
          A dedicated digital sanctuary celebrating your warmth, spirit, and friendship on 23 November.
        </p>

        {/* Footer Navigation links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-[#FFF8F0]/75 mb-8">
          <button onClick={() => onNavigate('hero')} className="hover:text-[#F6C8D5] transition">
            Home
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('countdown')} className="hover:text-[#F6C8D5] transition">
            Countdown
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('letter')} className="hover:text-[#F6C8D5] transition">
            The Letter
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('cake')} className="hover:text-[#F6C8D5] transition">
            Birthday Cake
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('gift')} className="hover:text-[#F6C8D5] transition">
            Surprise Gift
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('appreciation')} className="hover:text-[#F6C8D5] transition">
            Appreciation
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('gallery')} className="hover:text-[#F6C8D5] transition">
            Gallery
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('wishes')} className="hover:text-[#F6C8D5] transition">
            Wish Wall
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('private')} className="hover:text-[#D9BD83] transition flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Private Vault</span>
          </button>
        </div>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="mb-8 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#FFF8F0]/80 transition group"
        >
          <span>Back to Top</span>
          <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Bottom Credits & Zero-budget Note */}
        <div className="border-t border-white/10 pt-6 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFF8F0]/40 gap-2">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
            <span>for Lalee Patle • Zero-Cost Gift Architecture</span>
          </div>

          <div>
            <span>Asia/Kolkata Timezone • Full-Stack Vite + Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
