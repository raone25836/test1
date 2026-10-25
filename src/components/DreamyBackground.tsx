import React, { useEffect, useRef } from 'react';

/**
 * Dreamy canvas background rendering soft ambient stars, twinkling lights,
 * and pastel nebula glows matching the blush/lavender/ivory palette.
 * Fully responsive and supports prefers-reduced-motion.
 */
export const DreamyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Star data
    const starCount = Math.min(80, Math.floor((width * height) / 12000));
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      alphaSpeed: number;
      color: string;
    }> = [];

    const colors = ['#FFF8F0', '#F6C8D5', '#DCD3FA', '#D9BD83'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle twinkling stars
      for (const star of stars) {
        if (!prefersReducedMotion) {
          star.alpha += star.alphaSpeed;
          if (star.alpha > 0.95 || star.alpha < 0.2) {
            star.alphaSpeed = -star.alphaSpeed;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Deep Midnight Navy Background */}
      <div className="absolute inset-0 bg-[#171A35]" />

      {/* Atmospheric Pastel Glow Orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#DCD3FA]/18 blur-3xl" />
      <div className="absolute top-1/4 -right-28 h-[28rem] w-[28rem] rounded-full bg-[#F6C8D5]/15 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-[#D88BA5]/12 blur-3xl" />
      <div className="absolute -bottom-28 right-1/3 h-96 w-96 rounded-full bg-[#D9BD83]/14 blur-3xl" />

      {/* Canvas for Twinkling Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-80" />
    </div>
  );
};
