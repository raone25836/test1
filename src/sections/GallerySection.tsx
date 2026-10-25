import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight, Info, Camera, Heart } from 'lucide-react';
import { GalleryItem } from '../config/birthday';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items.length]);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  // Custom SVG Illustration Renderers
  const renderIllustration = (type: GalleryItem['illustrationType']) => {
    switch (type) {
      case 'starlight':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#171A35" />
                <stop offset="100%" stopColor="#2E3364" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad)" />
            {/* Crescent Moon */}
            <path d="M 310 70 A 30 30 0 1 0 350 110 A 25 25 0 1 1 310 70 Z" fill="#D9BD83" opacity="0.9" />
            {/* Stars */}
            <circle cx="80" cy="60" r="2.5" fill="#FFF8F0" />
            <circle cx="140" cy="110" r="1.8" fill="#F6C8D5" />
            <circle cx="220" cy="45" r="2.2" fill="#DCD3FA" />
            <circle cx="280" cy="140" r="1.5" fill="#FFF8F0" />
            <circle cx="60" cy="180" r="2" fill="#D9BD83" />
            {/* Peaceful Silhouette Horizon */}
            <path d="M 0 240 Q 100 210 200 235 T 400 220 L 400 300 L 0 300 Z" fill="#121429" />
            <path d="M 0 260 Q 150 240 300 265 T 400 255 L 400 300 L 0 300 Z" fill="#0C0E1E" />
          </svg>
        );
      case 'chai':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="chaiBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2E1C2B" />
                <stop offset="100%" stopColor="#1E192D" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#chaiBg)" />
            {/* Saucer */}
            <ellipse cx="200" cy="220" rx="90" ry="16" fill="#D9BD83" opacity="0.8" />
            {/* Cup */}
            <path d="M 140 130 L 150 205 C 150 215 250 215 250 205 L 260 130 Z" fill="#FFF8F0" />
            {/* Chai liquid */}
            <ellipse cx="200" cy="140" rx="48" ry="12" fill="#C88A58" />
            {/* Cup Handle */}
            <path d="M 255 145 C 285 145 285 190 248 190" fill="none" stroke="#FFF8F0" strokeWidth="8" strokeLinecap="round" />
            {/* Steam ribbons */}
            <path d="M 185 120 Q 175 90 190 65 T 180 35" fill="none" stroke="#F6C8D5" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            <path d="M 215 120 Q 225 90 210 65 T 220 35" fill="none" stroke="#DCD3FA" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
          </svg>
        );
      case 'sunset':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D88BA5" />
                <stop offset="50%" stopColor="#F6C8D5" />
                <stop offset="85%" stopColor="#D9BD83" />
                <stop offset="100%" stopColor="#171A35" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#sunsetGrad)" />
            <circle cx="200" cy="180" r="45" fill="#FFF8F0" opacity="0.9" />
            {/* Cloud silhouettes */}
            <ellipse cx="120" cy="140" rx="60" ry="16" fill="#DCD3FA" opacity="0.4" />
            <ellipse cx="280" cy="120" rx="70" ry="18" fill="#FFF8F0" opacity="0.3" />
            <path d="M 0 250 Q 200 230 400 250 L 400 300 L 0 300 Z" fill="#171A35" opacity="0.8" />
          </svg>
        );
      case 'books':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <rect width="400" height="300" fill="#202340" />
            {/* Stack of pastel books */}
            <rect x="130" y="210" width="140" height="24" rx="4" fill="#DCD3FA" />
            <rect x="140" y="180" width="125" height="25" rx="4" fill="#F6C8D5" />
            <rect x="150" y="152" width="110" height="24" rx="4" fill="#D9BD83" />
            {/* Wild floral stem resting on top */}
            <path d="M 160 145 Q 210 110 240 80" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="240" cy="80" r="7" fill="#F6C8D5" />
            <circle cx="240" cy="80" r="3" fill="#FFF8F0" />
          </svg>
        );
      case 'bloom':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <rect width="400" height="300" fill="#241B32" />
            {/* Bloom Petals */}
            <circle cx="200" cy="150" r="55" fill="#D88BA5" opacity="0.5" />
            <circle cx="170" cy="135" r="40" fill="#F6C8D5" opacity="0.7" />
            <circle cx="230" cy="135" r="40" fill="#F6C8D5" opacity="0.7" />
            <circle cx="200" cy="175" r="42" fill="#DCD3FA" opacity="0.7" />
            <circle cx="200" cy="150" r="20" fill="#D9BD83" />
            <circle cx="200" cy="150" r="12" fill="#FFF8F0" />
          </svg>
        );
      default: // laughter
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <rect width="400" height="300" fill="#1C2145" />
            {/* Sparkles, floating lanterns */}
            <circle cx="120" cy="100" r="18" fill="#D9BD83" opacity="0.6" />
            <circle cx="200" cy="80" r="24" fill="#F6C8D5" opacity="0.7" />
            <circle cx="280" cy="120" r="16" fill="#DCD3FA" opacity="0.6" />
            <circle cx="160" cy="180" r="14" fill="#FFF8F0" opacity="0.5" />
            <circle cx="250" cy="210" r="20" fill="#D88BA5" opacity="0.6" />
            {/* Twinkles */}
            <polygon points="200,60 205,75 220,80 205,85 200,100 195,85 180,80 195,75" fill="#FFF8F0" />
          </svg>
        );
    }
  };

  return (
    <section id="gallery" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BD83]/30 bg-[#D9BD83]/10 px-4 py-1 text-xs font-medium text-[#D9BD83] mb-3">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Illustrated Gallery</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
            Moments, Metaphors & Art
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto font-light mb-4">
            Custom artistic illustrations representing warmth and shared best-friend vibes.
          </p>

          <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs text-[#FFF8F0]/80">
            <Info className="h-3.5 w-3.5 text-[#F6C8D5]" />
            <span>Honest Note: These are tasteful illustrations until real photographs are added.</span>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-[#D9BD83] underline hover:text-[#FFF8F0] ml-1 font-medium cursor-pointer"
            >
              {showGuide ? 'Hide photo instructions' : 'How to add real photos?'}
            </button>
          </div>

          {/* Guide to replace illustrations */}
          {showGuide && (
            <div className="mt-4 p-5 rounded-2xl bg-white/10 border border-[#D9BD83]/40 text-left max-w-xl mx-auto text-xs text-[#FFF8F0]/90 animate-fadeIn">
              <h4 className="font-semibold text-[#D9BD83] flex items-center gap-1.5 mb-2">
                <Camera className="h-4 w-4" />
                How To Replace With Real Photos:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[#FFF8F0]/80 leading-relaxed">
                <li>Place your JPEG or PNG photos inside <code className="bg-black/30 px-1 py-0.5 rounded text-[#DCD3FA]">/public/photos/</code>.</li>
                <li>Open <code className="bg-black/30 px-1 py-0.5 rounded text-[#DCD3FA]">src/config/birthday.ts</code>.</li>
                <li>In the <code className="bg-black/30 px-1 py-0.5 rounded text-[#DCD3FA]">gallery</code> array, set <code className="bg-black/30 px-1 py-0.5 rounded text-[#DCD3FA]">realPhotoUrl: "/photos/photo1.jpg"</code> for each item.</li>
                <li>Or update captions anytime via the included Admin Dashboard!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View illustration: ${item.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedIndex(idx);
                }
              }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 shadow-lg hover:border-[#F6C8D5]/50 transition-all duration-300 cursor-pointer"
            >
              {/* Illustration Aspect Box */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#171A35] flex items-center justify-center">
                {item.realPhotoUrl ? (
                  <img
                    src={item.realPhotoUrl}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                    {renderIllustration(item.illustrationType)}
                  </div>
                )}
              </div>

              {/* Tag & Overlay */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#D9BD83] tracking-wide uppercase">
                    {item.yearTag}
                  </span>
                  <span className="text-[10px] text-[#FFF8F0]/40">
                    Artistic Illustration
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#FFF8F0] group-hover:text-[#F6C8D5] transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#FFF8F0]/65 line-clamp-2 font-light">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-[#F6C8D5]"
            aria-label="Close image lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : items.length - 1
              )
            }
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Lightbox Center Card */}
          <div className="max-w-2xl w-full bg-[#171A35] rounded-3xl overflow-hidden border border-[#F6C8D5]/30 shadow-2xl">
            <div className="aspect-[4/3] w-full bg-black/40 flex items-center justify-center">
              {activeItem.realPhotoUrl ? (
                <img
                  src={activeItem.realPhotoUrl}
                  alt={activeItem.alt}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full">
                  {renderIllustration(activeItem.illustrationType)}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-[#D9BD83] font-medium mb-1">
                <span>{activeItem.yearTag}</span>
                <span>{selectedIndex + 1} of {items.length}</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#FFF8F0] mb-2">
                {activeItem.title}
              </h3>
              <p className="text-sm text-[#FFF8F0]/80 leading-relaxed font-light">
                {activeItem.caption}
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#DCD3FA]/60">
                <span>Press Esc to close, Arrow keys to navigate</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-[#F6C8D5]" /> For Lalee
                </span>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev < items.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
};
