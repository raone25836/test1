/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BIRTHDAY_CONFIG, BirthdayConfig } from './config/birthday';
import { calculateBirthdayCountdown, CountdownResult } from './utils/countdown';
import { Navbar } from './components/Navbar';
import { DreamyBackground } from './components/DreamyBackground';
import { Confetti } from './components/Confetti';
import { AudioPlayer } from './components/AudioPlayer';
import { Footer } from './components/Footer';

// Sections
import { HeroSection } from './sections/HeroSection';
import { CountdownSection } from './sections/CountdownSection';
import { LetterSection } from './sections/LetterSection';
import { CakeSection } from './sections/CakeSection';
import { GiftSection } from './sections/GiftSection';
import { AppreciationSection } from './sections/AppreciationSection';
import { GallerySection } from './sections/GallerySection';
import { WishWallSection } from './sections/WishWallSection';
import { PrivateMemoriesSection } from './sections/PrivateMemoriesSection';
import { AdminSection } from './sections/AdminSection';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(BIRTHDAY_CONFIG);
  const [activeSection, setActiveSection] = useState('hero');
  const [showConfetti, setShowConfetti] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Live countdown state
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    calculateBirthdayCountdown(config.birthDay, config.birthMonth, config.timezone)
  );

  // Fetch dynamic server configuration on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.warn('Could not load server config:', err));
  }, []);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(
        calculateBirthdayCountdown(config.birthDay, config.birthMonth, config.timezone)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [config.birthDay, config.birthMonth, config.timezone]);

  // Smooth scroll to section
  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const triggerCelebration = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleOpenSurprise = useCallback(() => {
    triggerCelebration();
    handleNavigate('gift');
  }, [triggerCelebration, handleNavigate]);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  const handleConfigUpdated = (newConfig: Partial<BirthdayConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="min-h-screen bg-[#171A35] text-[#FFF8F0] font-sans antialiased selection:bg-[#F6C8D5] selection:text-[#171A35] relative">
      {/* Visual Ambiance & Particle Canvas */}
      <DreamyBackground />

      {/* Confetti Particle Burst on Celebration */}
      <Confetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Navigation Header */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAuthenticated={Boolean(authToken)}
      />

      {/* Main Experience Layout */}
      <main className="relative z-10 flex flex-col space-y-4">
        {/* Page A: Public Birthday Homepage */}
        <HeroSection
          config={config}
          countdown={countdown}
          onOpenSurprise={handleOpenSurprise}
          onNavigate={handleNavigate}
        />

        {/* Page B: Live Birthday Countdown */}
        <CountdownSection
          countdown={countdown}
          config={config}
          onNavigate={handleNavigate}
        />

        {/* Page C: The Birthday Letter */}
        <LetterSection letter={config.letter} />

        {/* Page D: Interactive Birthday Cake */}
        <CakeSection onCelebrate={triggerCelebration} />

        {/* Page E: Surprise Gift Package */}
        <GiftSection
          config={config}
          onOpenSurpriseTrigger={triggerCelebration}
        />

        {/* Page F: Appreciation Cards */}
        <AppreciationSection cards={config.appreciationCards} />

        {/* Page G: Photo Gallery & Lightbox */}
        <GallerySection items={config.gallery} />

        {/* Page H: Guest Wish Wall */}
        <WishWallSection onWishSubmitted={triggerCelebration} />

        {/* Page I: Protected Private Memories */}
        <PrivateMemoriesSection
          authToken={authToken}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />

        {/* Page J: Protected Admin Dashboard */}
        <AdminSection
          authToken={authToken}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          config={config}
          onConfigUpdated={handleConfigUpdated}
        />
      </main>

      {/* Global Ambient Audio Player */}
      <AudioPlayer />

      {/* Elegant Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
