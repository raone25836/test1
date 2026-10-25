import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Heart, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface WishWallSectionProps {
  onWishSubmitted?: () => void;
}

export const WishWallSection: React.FC<WishWallSectionProps> = ({ onWishSubmitted }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch wishes from server API
  const fetchWishes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wishes');
      if (!res.ok) throw new Error('Failed to load wishes');
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch (err) {
      console.warn('Could not fetch wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side quick checks
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }
    if (trimmedName.length > 50) {
      setErrorMsg('Name must be under 50 characters.');
      return;
    }
    if (trimmedMessage.length < 5) {
      setErrorMsg('Please write a warm wish of at least 5 characters.');
      return;
    }
    if (trimmedMessage.length > 600) {
      setErrorMsg('Message cannot exceed 600 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, message: trimmedMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit wish');
      }

      setSuccessMsg('Your birthday wish has been delivered to Lalee! 💌');
      setName('');
      setMessage('');
      // Refresh wall
      fetchWishes();
      if (onWishSubmitted) onWishSubmitted();

      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D88BA5]/25 bg-[#D88BA5]/10 px-4 py-1 text-xs font-medium text-[#F6C8D5] mb-3">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Community Wish Wall</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
            Leave a Birthday Wish For Lalee
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto font-light">
            Apna naam aur ek pyaara sa message likhein. Every kind word makes her special day brighter!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <h3 className="font-serif text-xl font-medium text-[#FFF8F0] mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D9BD83]" />
              Write Your Wish
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mb-6 font-light">
              Messages are filtered for kindness and stored persistently on our server.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="guest-name" className="block text-xs font-medium text-[#DCD3FA] mb-1.5">
                  Your Name / Display Name
                </label>
                <input
                  id="guest-name"
                  type="text"
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha, Ankit, Neha..."
                  required
                  disabled={submitting}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#171A35]/60 border border-white/15 text-sm text-[#FFF8F0] placeholder:text-white/30 focus:outline-none focus:border-[#F6C8D5] focus:ring-1 focus:ring-[#F6C8D5] transition"
                />
                <div className="mt-1 flex justify-end text-[10px] text-[#FFF8F0]/40">
                  {name.length}/50
                </div>
              </div>

              <div>
                <label htmlFor="guest-message" className="block text-xs font-medium text-[#DCD3FA] mb-1.5">
                  Your Birthday Message
                </label>
                <textarea
                  id="guest-message"
                  rows={4}
                  maxLength={600}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lalee, wishing you endless joy, success, and peace on your 23 November birthday! Keep shining..."
                  required
                  disabled={submitting}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#171A35]/60 border border-white/15 text-sm text-[#FFF8F0] placeholder:text-white/30 focus:outline-none focus:border-[#F6C8D5] focus:ring-1 focus:ring-[#F6C8D5] transition resize-none"
                />
                <div className="mt-1 flex justify-end text-[10px] text-[#FFF8F0]/40">
                  {message.length}/600
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Wish...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post Birthday Wish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Wish Wall Feed (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#D9BD83] font-semibold">
                Approved Wishes ({wishes.length})
              </span>
              <button
                onClick={fetchWishes}
                className="text-xs text-[#DCD3FA]/70 hover:text-white underline cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-[#FFF8F0]/50 bg-white/5 rounded-3xl border border-white/5">
                Loading warm wishes...
              </div>
            ) : wishes.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white/5 border border-white/10 text-[#FFF8F0]/60">
                <Heart className="h-6 w-6 text-[#F6C8D5] mx-auto mb-2 opacity-60" />
                <p className="text-sm">Be the first to leave a wish for Lalee!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-[#F6C8D5]/30 backdrop-blur-md transition shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#D88BA5] to-[#DCD3FA] text-[#171A35] flex items-center justify-center font-bold text-xs">
                          {w.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-serif font-semibold text-sm text-[#FFF8F0]">
                          {w.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#FFF8F0]/40">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#FFF8F0]/85 leading-relaxed font-light pl-9">
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
