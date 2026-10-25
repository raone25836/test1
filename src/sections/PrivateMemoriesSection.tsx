import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Key, Plus, Trash2, ShieldAlert, Sparkles, Tag, Calendar } from 'lucide-react';
import { PrivateMemory } from '../config/birthday';

interface PrivateMemoriesSectionProps {
  authToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

export const PrivateMemoriesSection: React.FC<PrivateMemoriesSectionProps> = ({
  authToken,
  onLoginSuccess,
  onLogout,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<PrivateMemory[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // New Memory Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Fetch private memories from server with Bearer token
  const fetchPrivateMemories = async (token: string) => {
    try {
      setFetchLoading(true);
      setErrorMsg(null);
      const res = await fetch('/api/private/memories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized or session expired. Please unlock again.');
        }
        throw new Error('Failed to load private memories.');
      }

      const data = await res.json();
      setMemories(data.memories || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading memories';
      setErrorMsg(msg);
      onLogout(); // invalidate token if unauthorized
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchPrivateMemories(authToken);
    } else {
      setMemories([]);
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password.trim()) {
      setErrorMsg('Please enter the owner passcode.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid passcode');
      }

      setPassword('');
      onLoginSuccess(data.token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg('Title and note content are required.');
      return;
    }

    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/private/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          date: newDate.trim() || 'Special Memory',
          category: newCategory.trim() || 'Personal Note',
          content: newContent.trim(),
          tags: tagsArray,
        }),
      });

      if (!res.ok) throw new Error('Failed to save private note');

      setNewTitle('');
      setNewDate('');
      setNewCategory('');
      setNewContent('');
      setNewTags('');
      setShowAddForm(false);
      fetchPrivateMemories(authToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save memory';
      setErrorMsg(msg);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!authToken || !window.confirm('Delete this private memory permanently?')) return;

    try {
      const res = await fetch(`/api/private/memories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error('Failed to delete');
      fetchPrivateMemories(authToken);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="private" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BD83]/30 bg-[#D9BD83]/10 px-4 py-1 text-xs font-medium text-[#D9BD83] mb-3">
            <Lock className="h-3.5 w-3.5" />
            <span>Server-Protected Private Vault</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] mb-3">
            Private Memories & Personal Notes
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8F0]/70 max-w-xl mx-auto font-light">
            A secured, encrypted corner exclusively for personal reflections. Content is strictly withheld by the server until valid owner authentication is presented.
          </p>
        </div>

        {!authToken ? (
          /* Locked State: Authenticate Form */
          <div className="max-w-md mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#171A35] border border-[#F6C8D5]/30 text-[#F6C8D5] mb-5 shadow-inner">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-xl font-medium text-[#FFF8F0] mb-2">
              Passcode Protected Section
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mb-6 font-light leading-relaxed">
              Enter the private access password to unlock these personal reflections.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn text-left">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode..."
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl bg-[#171A35]/80 border border-white/15 text-sm text-[#FFF8F0] placeholder:text-white/30 focus:outline-none focus:border-[#F6C8D5] focus:ring-1 focus:ring-[#F6C8D5] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Verifying with server...</span>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Unlock Private Vault</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#DCD3FA]/60 text-center">
              <span>Default owner test passcode: </span>
              <code className="text-[#D9BD83] bg-black/30 px-1.5 py-0.5 rounded font-mono">lalee2026</code>
            </div>
          </div>
        ) : (
          /* Unlocked State: Display Private Memories */
          <div className="space-y-6">
            {/* Vault Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
                <Unlock className="h-4 w-4" />
                <span>Private Vault Authenticated & Unlocked</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs text-[#FFF8F0] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showAddForm ? 'Cancel Note' : 'Add Note'}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs text-rose-200 transition cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Vault</span>
                </button>
              </div>
            </div>

            {/* Add Memory Drawer */}
            {showAddForm && (
              <form onSubmit={handleAddMemory} className="p-6 rounded-3xl bg-white/10 border border-[#D9BD83]/40 backdrop-blur-md space-y-4 animate-fadeIn">
                <h3 className="font-serif text-lg font-medium text-[#FFF8F0]">
                  Record a New Personal Note
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Title (e.g. Next Road Trip Promise)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="px-3.5 py-2 rounded-xl bg-[#171A35] border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Date / Occasion tag"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#171A35] border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Promise, Goal)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#171A35] border border-white/15 text-xs text-white"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Write the heartfelt private memory or reminder here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#171A35] border border-white/15 text-xs text-white resize-none"
                />

                <input
                  type="text"
                  placeholder="Tags separated by commas (e.g. friendship, support, goals)"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#171A35] border border-white/15 text-xs text-white"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#D9BD83] text-[#171A35] font-semibold text-xs shadow hover:scale-105 transition"
                  >
                    Save Secret Memory
                  </button>
                </div>
              </form>
            )}

            {/* List of Private Memories */}
            {fetchLoading ? (
              <div className="p-8 text-center text-xs text-[#FFF8F0]/50">
                Fetching confidential records...
              </div>
            ) : memories.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white/5 border border-white/10 text-[#FFF8F0]/60">
                No private memories saved yet. Click "Add Note" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/15 shadow-xl backdrop-blur-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[#D9BD83] font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {mem.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#FFF8F0]/50 flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3" />
                            {mem.date}
                          </span>
                          <button
                            onClick={() => handleDeleteMemory(mem.id)}
                            className="text-rose-400 hover:text-rose-200 transition p-1"
                            title="Delete note"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-medium text-[#FFF8F0] mb-3">
                        {mem.title}
                      </h3>

                      <p className="text-sm text-[#FFF8F0]/85 leading-relaxed font-light mb-4">
                        {mem.content}
                      </p>
                    </div>

                    {mem.tags && mem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                        {mem.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-[#DCD3FA]"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
