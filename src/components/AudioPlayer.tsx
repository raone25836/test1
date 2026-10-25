import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

/**
 * Dreamy Ambient Synthesizer using Web Audio API.
 * Creates an ethereal, celestial pentatonic music box / harp arpeggio.
 * Completely self-contained: ₹0 budget, zero external MP3 dependencies,
 * user-controlled, compliant with browser autoplay policies.
 */
export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Pentatonic notes frequencies (Hz) for a dreamy, peaceful atmosphere:
  // C major / A minor pentatonic in octaves 4 and 5
  const NOTES = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ];

  const playChimeNote = (ctx: AudioContext, masterGain: GainNode, freq: number) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Use sine and gentle triangle for sweet, bell-like warmth
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope: quick gentle attack, long dreamy decay
    noteGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 2.6);
  };

  const startMusic = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }

      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);

      // Play celestial arpeggiated sequence
      let step = 0;
      const sequence = [0, 2, 4, 7, 5, 3, 2, 6, 4, 8, 5, 2];

      // Play immediate first note
      playChimeNote(ctx, gainNodeRef.current, NOTES[sequence[0]]);

      intervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || !gainNodeRef.current) return;
        step = (step + 1) % sequence.length;
        const noteIdx = sequence[step];
        playChimeNote(audioCtxRef.current, gainNodeRef.current, NOTES[noteIdx]);
        
        // Occasionally play a soft low root harmony
        if (step % 4 === 0) {
          playChimeNote(audioCtxRef.current, gainNodeRef.current, 130.81); // C3
        }
      }, 750);

      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio playback not supported or blocked:', err);
    }
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        nextMute ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[#171A35]/90 p-1.5 sm:p-2 backdrop-blur-md border border-[#F6C8D5]/25 shadow-xl shadow-purple-950/40 text-xs transition-all duration-300 hover:border-[#F6C8D5]/50 group"
      role="region"
      aria-label="Ambient Birthday Music Player"
    >
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#D88BA5] to-[#DCD3FA] text-[#171A35] font-semibold transition hover:scale-105 active:scale-95 shadow-md shrink-0 cursor-pointer"
        aria-label={isPlaying ? 'Pause background melody' : 'Play peaceful background melody'}
        title={isPlaying ? 'Pause music' : 'Play peaceful ambient melody'}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" /> : <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" />}
      </button>

      <div className="hidden sm:flex flex-col pr-1">
        <span className="font-medium text-[#FFF8F0] flex items-center gap-1 text-[11px] leading-tight">
          <Sparkles className="h-3 w-3 text-[#D9BD83] animate-pulse" />
          {isPlaying ? 'Dreamy Melody' : 'Celestial Ambiance'}
        </span>
        <span className="text-[10px] text-[#DCD3FA]/70">User-controlled • Ambient audio</span>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1.5 pl-1 pr-2 border-l border-white/10">
          <button
            onClick={toggleMute}
            className="p-1 text-[#FFF8F0]/80 hover:text-white transition"
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-300" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Music volume slider"
            className="w-14 h-1 accent-[#D88BA5] cursor-pointer bg-white/20 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
