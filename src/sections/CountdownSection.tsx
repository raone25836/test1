import React from 'react';
import { Clock, Sparkles, Globe, Heart } from 'lucide-react';
import { CountdownResult } from '../utils/countdown';
import { BirthdayConfig } from '../config/birthday';

interface CountdownSectionProps {
  countdown: CountdownResult;
  config: BirthdayConfig;
  onNavigate: (section: string) => void;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  countdown,
  config,
  onNavigate,
}) => {
  const units = [
    { label: 'Days', value: countdown.days, sub: 'Dino ka intezaar' },
    { label: 'Hours', value: countdown.hours, sub: 'Ghante' },
    { label: 'Minutes', value: countdown.minutes, sub: 'Minute' },
    { label: 'Seconds', value: countdown.seconds, sub: 'Second' },
  ];

  return (
    <section id="countdown" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Heading */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F6C8D5]/20 bg-[#F6C8D5]/10 px-4 py-1 text-xs font-medium text-[#F6C8D5] mb-4">
          <Clock className="h-3.5 w-3.5" />
          <span>Live Birthday Countdown</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
          Counting Down to <span className="text-[#D9BD83] italic">{config.birthDay} November</span>
        </h2>
        <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto mb-10 font-light">
          Calculated accurately for the <span className="text-[#DCD3FA] font-medium">{config.timezone}</span> timezone. Har guzarta second Lalee ke special din ke kareeb le jaa raha hai.
        </p>

        {/* Celebration State on Birthday */}
        {countdown.isBirthday ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#D88BA5]/25 via-[#F6C8D5]/20 to-[#DCD3FA]/20 border border-[#F6C8D5]/40 backdrop-blur-xl shadow-2xl shadow-rose-950/40 animate-pulse">
            <span className="text-5xl sm:text-6xl mb-4 block">🎂✨🎉</span>
            <h3 className="font-serif text-3xl sm:text-5xl text-[#FFF8F0] font-semibold mb-3">
              IT'S LALEE'S BIRTHDAY TODAY!
            </h3>
            <p className="text-lg text-[#FFF8F0]/90 max-w-lg mx-auto mb-6">
              Aaj 23 November hai! Lalee, tera ye din khushiyon, blessings aur endless smiles se bhara rahe!
            </p>
            <button
              onClick={() => onNavigate('cake')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D88BA5] to-[#DCD3FA] text-[#171A35] font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition"
            >
              Blow Your Birthday Candles Now 🎂
            </button>
          </div>
        ) : (
          /* Normal Countdown Grid */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="relative overflow-hidden rounded-3xl border border-[#F6C8D5]/20 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-lg shadow-black/20 hover:border-[#F6C8D5]/40 transition group"
              >
                {/* Decorative background glow */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#DCD3FA]/10 blur-xl group-hover:bg-[#F6C8D5]/20 transition" />

                <div className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFF8F0] mb-2 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-widest text-[#D9BD83] font-semibold mb-1">
                  {unit.label}
                </div>
                <div className="text-[11px] text-[#FFF8F0]/50 font-light">
                  {unit.sub}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timezone & Target Metadata Details */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[#FFF8F0]/60">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Globe className="h-3.5 w-3.5 text-[#DCD3FA]" />
            <span>Timezone: <strong>{config.timezone} (IST)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Sparkles className="h-3.5 w-3.5 text-[#D9BD83]" />
            <span>Target: <strong>{countdown.formattedTarget}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Heart className="h-3.5 w-3.5 text-[#F6C8D5]" />
            <span>Auto-rolls over year without hardcoding</span>
          </div>
        </div>
      </div>
    </section>
  );
};
