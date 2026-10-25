import React, { useState } from 'react';
import { Sparkles, Heart, Gift, Cake, Image as ImageIcon, MessageSquare, Lock, ShieldCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isAuthenticated,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'countdown', label: 'Countdown', icon: Sparkles },
    { id: 'letter', label: 'The Letter', icon: Heart },
    { id: 'cake', label: 'Birthday Cake', icon: Cake },
    { id: 'gift', label: 'Surprise Gift', icon: Gift },
    { id: 'appreciation', label: 'Appreciation', icon: Heart },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'wishes', label: 'Wish Wall', icon: MessageSquare },
    { id: 'private', label: 'Private Vault', icon: Lock },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#171A35]/80 backdrop-blur-md border-b border-[#F6C8D5]/15 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Title */}
        <button
          onClick={() => handleItemClick('hero')}
          className="flex items-center gap-2 text-left group transition focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#D88BA5] via-[#F6C8D5] to-[#DCD3FA] text-[#171A35] shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="block font-serif text-lg font-semibold tracking-wide text-[#FFF8F0] group-hover:text-[#F6C8D5] transition">
              Lalee Patle
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-[#D9BD83]">
              23 November
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#F6C8D5]/20 text-[#FFF8F0] border border-[#F6C8D5]/40 shadow-sm shadow-[#F6C8D5]/20'
                    : 'text-[#FFF8F0]/75 hover:text-[#FFF8F0] hover:bg-white/5'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#F6C8D5]' : 'text-[#DCD3FA]/70'}`} />
                {item.label}
                {item.id === 'private' && isAuthenticated && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#FFF8F0] hover:bg-white/10 transition"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#F6C8D5]/15 bg-[#171A35]/95 px-4 py-4 backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#F6C8D5]/20 text-[#FFF8F0] border border-[#F6C8D5]/40'
                      : 'text-[#FFF8F0]/80 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#F6C8D5]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
