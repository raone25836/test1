import React, { useState } from 'react';
import { Heart, Sparkles, Star, RotateCcw, Filter } from 'lucide-react';
import { AppreciationCard } from '../config/birthday';

interface AppreciationSectionProps {
  cards: AppreciationCard[];
}

export const AppreciationSection: React.FC<AppreciationSectionProps> = ({ cards }) => {
  // Set of opened card IDs
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set(['card-1', 'card-2']));
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const toggleCard = (id: string) => {
    setOpenedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openAll = () => {
    setOpenedCards(new Set(cards.map((c) => c.id)));
  };

  const closeAll = () => {
    setOpenedCards(new Set());
  };

  const filteredCards = activeFilter === 'all'
    ? cards
    : cards.filter((c) => c.category === activeFilter);

  const categories = [
    { id: 'all', label: 'All Wishes' },
    { id: 'friendship', label: 'Friendship' },
    { id: 'vibes', label: 'Peace & Vibes' },
    { id: 'growth', label: 'Growth' },
    { id: 'strength', label: 'Individuality' },
  ];

  return (
    <section id="appreciation" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCD3FA]/30 bg-[#DCD3FA]/10 px-4 py-1 text-xs font-medium text-[#DCD3FA] mb-3">
            <Heart className="h-3.5 w-3.5 text-[#F6C8D5]" />
            <span>Appreciation For Lalee</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
            Little Affirmations & Compliments
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto font-light">
            8 heartfelt appreciation cards celebrating who you are. Tap each card to flip and reveal the message!
          </p>

          {/* Controls Bar: Category Filters & Open All */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    activeFilter === cat.id
                      ? 'bg-[#F6C8D5] text-[#171A35] shadow-sm'
                      : 'text-[#FFF8F0]/70 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={openAll}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#FFF8F0]/80 transition"
              >
                Reveal All
              </button>
              <button
                onClick={closeAll}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#FFF8F0]/80 transition flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCards.map((card, idx) => {
            const isOpened = openedCards.has(card.id);

            return (
              <div
                key={card.id}
                onClick={() => toggleCard(card.id)}
                role="button"
                tabIndex={0}
                aria-label={`Appreciation card ${card.title}: ${isOpened ? 'opened' : 'closed'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(card.id);
                  }
                }}
                className={`relative min-h-[220px] rounded-3xl p-6 transition-all duration-500 cursor-pointer select-none border backdrop-blur-md flex flex-col justify-between group ${
                  isOpened
                    ? 'bg-gradient-to-br from-[#FFF8F0] via-[#FFF6EE] to-[#F6C8D5]/30 text-[#171A35] border-[#F6C8D5] shadow-xl shadow-rose-950/20 translate-y-[-2px]'
                    : 'bg-white/5 hover:bg-white/10 text-[#FFF8F0] border-white/15 hover:border-[#DCD3FA]/40 shadow-lg'
                }`}
              >
                {/* Card Top Banner */}
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{card.emoji}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isOpened
                        ? 'bg-[#171A35]/10 text-[#171A35]'
                        : 'bg-white/10 text-[#DCD3FA]'
                    }`}
                  >
                    Card {idx + 1}
                  </span>
                </div>

                {/* Card Body */}
                <div className="my-3">
                  <h3
                    className={`font-serif text-lg font-semibold mb-2 ${
                      isOpened ? 'text-[#171A35]' : 'text-[#FFF8F0]'
                    }`}
                  >
                    {card.title}
                  </h3>

                  {isOpened ? (
                    <div className="animate-fadeIn">
                      <p className="text-sm font-medium text-[#171A35] leading-relaxed mb-2 italic">
                        "{card.hinglishQuote}"
                      </p>
                      <p className="text-xs text-[#171A35]/65 leading-normal">
                        {card.englishSubtext}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-1 py-4 text-[#FFF8F0]/50 text-xs">
                      <span>Click to flip & reveal ✨</span>
                      <span className="text-[11px] text-[#D9BD83] font-light">
                        A personal thought for Lalee
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom status */}
                <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span
                    className={
                      isOpened ? 'text-[#D88BA5] font-semibold' : 'text-[#FFF8F0]/40'
                    }
                  >
                    {isOpened ? 'Revealed' : 'Tap to open'}
                  </span>
                  <Sparkles
                    className={`h-3.5 w-3.5 ${
                      isOpened
                        ? 'text-[#D9BD83]'
                        : 'text-white/20 group-hover:text-[#DCD3FA]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
