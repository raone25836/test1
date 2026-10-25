import React, { useState } from 'react';
import { Heart, RotateCcw, Mail, Sparkles, Feather, Check } from 'lucide-react';
import { BirthdayLetter } from '../config/birthday';

interface LetterSectionProps {
  letter: BirthdayLetter;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ letter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleReplay = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsOpen(true);
    }, 400);
  };

  const handleCopy = () => {
    const fullText = `${letter.salutation}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.signOff}\n${letter.senderName}`;
    navigator.clipboard.writeText(fullText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="letter" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D88BA5]/25 bg-[#D88BA5]/10 px-4 py-1 text-xs font-medium text-[#F6C8D5] mb-3">
            <Feather className="h-3.5 w-3.5" />
            <span>A Personal Letter For Lalee</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FFF8F0] font-normal mb-3">
            Words From The Heart
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-lg mx-auto font-light">
            Dil se likhi hui baatein ek aisi dost ke liye jo hamesha bina kisi shart ke saath khadi rehti hai.
          </p>
        </div>

        {/* The Letter Card / Parchment Aesthetic */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FFF8F0]/95 via-[#FFF8F0]/90 to-[#FFF8F0]/85 text-[#171A35] p-8 sm:p-12 shadow-2xl shadow-rose-950/30 border border-[#F6C8D5]/60 transition-all duration-700">
          {/* Subtle Vintage Letter Header Border */}
          <div className="flex items-center justify-between border-b border-[#171A35]/15 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171A35] text-[#F6C8D5]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-semibold block text-[#171A35]">
                  {letter.title}
                </span>
                <span className="text-xs text-[#171A35]/60">
                  Written for Lalee Patle • 23 November
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReplay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#171A35]/5 hover:bg-[#171A35]/10 text-[#171A35] transition"
                title="Replay reveal"
                aria-label="Replay letter reveal animation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Read Again</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#171A35]/5 hover:bg-[#171A35]/10 text-[#171A35] transition"
                title="Copy letter"
                aria-label="Copy letter text"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Letter Content */}
          <div className={`transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171A35] mb-6 italic">
              {letter.salutation}
            </h3>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#171A35]/85 font-normal">
              {letter.paragraphs.map((paragraph, index) => (
                <p key={index} className="transition-all">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Sign Off */}
            <div className="mt-10 pt-6 border-t border-[#171A35]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="block text-sm text-[#171A35]/70 italic">
                  {letter.signOff}
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D88BA5]">
                  {letter.senderName}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#171A35]/5 px-4 py-1.5 text-xs text-[#171A35]/70">
                <Heart className="h-3.5 w-3.5 fill-[#D88BA5] text-[#D88BA5]" />
                <span>Pure Best Friendship • Sincere Gift</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
