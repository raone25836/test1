import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Trash2, Key, RefreshCw, Edit3, Save, AlertCircle, BarChart3, Lock } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday';

interface AdminSectionProps {
  authToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  config: BirthdayConfig;
  onConfigUpdated: (newConfig: Partial<BirthdayConfig>) => void;
}

interface AdminWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: 'approved' | 'rejected' | 'pending';
}

interface StatsData {
  totalWishes: number;
  approvedWishes: number;
  pendingWishes: number;
  totalMemories: number;
  recipient: string;
  birthdayDate: string;
  timezone: string;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  authToken,
  onLoginSuccess,
  onLogout,
  config,
  onConfigUpdated,
}) => {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dashboard Data
  const [wishes, setWishes] = useState<AdminWish[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [wishFilter, setWishFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Letter Editing state
  const [editableSalutation, setEditableSalutation] = useState(config.letter.salutation);
  const [editableSender, setEditableSender] = useState(config.letter.senderName);
  const [editableFirstPara, setEditableFirstPara] = useState(config.letter.paragraphs[0] || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load admin data
  const loadAdminData = async (token: string) => {
    try {
      setLoading(true);

      const [wishesRes, statsRes] = await Promise.all([
        fetch('/api/admin/wishes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/stats'),
      ]);

      if (wishesRes.ok) {
        const data = await wishesRes.json();
        setWishes(data.wishes || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadAdminData(authToken);
    }
  }, [authToken]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setPassword('');
      onLoginSuccess(data.token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/wishes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');
      loadAdminData(authToken);
      setActionMsg(`Wish marked as ${newStatus}`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (!authToken || !window.confirm('Permanently delete this guest wish?')) return;
    try {
      const res = await fetch(`/api/admin/wishes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      loadAdminData(authToken);
      setActionMsg('Wish deleted permanently');
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      const updatedParas = [...config.letter.paragraphs];
      updatedParas[0] = editableFirstPara;

      const updatedLetter = {
        ...config.letter,
        salutation: editableSalutation,
        senderName: editableSender,
        paragraphs: updatedParas,
      };

      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ letter: updatedLetter }),
      });

      if (!res.ok) throw new Error('Failed to update config on server');

      onConfigUpdated({ letter: updatedLetter });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Config save error:', err);
    }
  };

  const filteredWishes = wishes.filter((w) => {
    if (wishFilter === 'all') return true;
    return w.status === wishFilter;
  });

  return (
    <section id="admin" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BD83]/30 bg-[#D9BD83]/10 px-4 py-1 text-xs font-medium text-[#D9BD83] mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Site Administration</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
            Owner Dashboard
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto font-light">
            Review guest submissions, moderate wishes, edit letter text, and oversee celebration statistics.
          </p>
        </div>

        {!authToken ? (
          /* Login Card */
          <div className="max-w-md mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#171A35] border border-[#D9BD83]/40 text-[#D9BD83] mb-5">
              <Key className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-xl font-medium text-[#FFF8F0] mb-2">
              Owner Sign-In
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mb-6 font-light">
              Server-side session verification. Unauthorized requests receive HTTP 401.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#171A35]/80 border border-white/15 text-sm text-[#FFF8F0] focus:outline-none focus:border-[#D9BD83]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#D9BD83] text-[#171A35] font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In as Owner'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#DCD3FA]/60">
              Default owner password: <code className="text-[#D9BD83] font-mono">lalee2026</code>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="space-y-8 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-[#FFF8F0]">
                  Owner Session Active
                </span>
                <span className="text-[11px] text-[#DCD3FA]/60">
                  (Cryptographically authenticated Bearer token)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => authToken && loadAdminData(authToken)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#FFF8F0] transition flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs text-rose-200 transition flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-[#FFF8F0]/60 block mb-1">Total Wishes</span>
                  <span className="font-serif text-3xl font-bold text-[#D9BD83]">{stats.totalWishes}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-[#FFF8F0]/60 block mb-1">Approved Public</span>
                  <span className="font-serif text-3xl font-bold text-emerald-400">{stats.approvedWishes}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-[#FFF8F0]/60 block mb-1">Private Notes</span>
                  <span className="font-serif text-3xl font-bold text-[#F6C8D5]">{stats.totalMemories}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-[#FFF8F0]/60 block mb-1">Birthday Date</span>
                  <span className="font-serif text-2xl font-bold text-[#DCD3FA]">{stats.birthdayDate}</span>
                </div>
              </div>
            )}

            {actionMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs text-center animate-fadeIn">
                {actionMsg}
              </div>
            )}

            {/* Tabbed Sections: 1. Wishes Moderation, 2. Letter Customizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Wish Wall Moderation (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-medium text-[#FFF8F0] flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#D9BD83]" />
                    Guest Wishes Moderation
                  </h3>

                  {/* Filter Pills */}
                  <div className="flex gap-1 bg-white/5 p-1 rounded-xl text-xs">
                    {(['all', 'approved', 'rejected'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setWishFilter(f)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition ${
                          wishFilter === f
                            ? 'bg-[#D9BD83] text-[#171A35] font-medium'
                            : 'text-[#FFF8F0]/60 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredWishes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#FFF8F0]/50">
                    No wishes found under this filter.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredWishes.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 rounded-2xl bg-[#171A35]/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#FFF8F0] text-sm">
                              {w.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                w.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                          <p className="text-[#FFF8F0]/80 font-light leading-relaxed">
                            {w.message}
                          </p>
                          <span className="text-[10px] text-[#FFF8F0]/40 block">
                            {new Date(w.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          {w.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(w.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition flex items-center gap-1"
                              title="Approve wish for public wall"
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {w.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(w.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition flex items-center gap-1"
                              title="Reject / hide wish from public"
                            >
                              <X className="h-3 w-3" />
                              <span>Hide</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteWish(w.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Letter Customizer Form (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <h3 className="font-serif text-xl font-medium text-[#FFF8F0] mb-2 flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-[#F6C8D5]" />
                  Edit Birthday Letter
                </h3>
                <p className="text-xs text-[#FFF8F0]/60 mb-5 font-light">
                  Changes update the letter instantly and persist on the server.
                </p>

                {saveSuccess && (
                  <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs text-center animate-fadeIn">
                    Letter updated successfully!
                  </div>
                )}

                <form onSubmit={handleSaveLetter} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#DCD3FA] font-medium mb-1">
                      Salutation
                    </label>
                    <input
                      type="text"
                      value={editableSalutation}
                      onChange={(e) => setEditableSalutation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#171A35] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#DCD3FA] font-medium mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={editableSender}
                      onChange={(e) => setEditableSender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#171A35] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#DCD3FA] font-medium mb-1">
                      Opening Paragraph
                    </label>
                    <textarea
                      rows={5}
                      value={editableFirstPara}
                      onChange={(e) => setEditableFirstPara(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#171A35] border border-white/15 text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#D88BA5] to-[#DCD3FA] text-[#171A35] font-semibold text-xs shadow hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
