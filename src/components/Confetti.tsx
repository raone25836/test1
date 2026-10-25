import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
  shape: 'rect' | 'circle' | 'star';
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = ['#F6C8D5', '#DCD3FA', '#FFF8F0', '#D88BA5', '#D9BD83', '#FFE4E6'];
    const particles: Particle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 4) + (Math.random() * Math.PI) / 2; // Upward spray
      const speed = Math.random() * 12 + 8;
      particles.push({
        x: width / 2 + (Math.random() * 200 - 100),
        y: height * 0.65,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        angle: Math.random() * 360,
        angularVelocity: Math.random() * 8 - 4,
        width: Math.random() * 8 + 6,
        height: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        shape: Math.random() > 0.3 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'star',
      });
    }

    let animationId: number;
    let frames = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frames++;

      let alive = 0;

      for (const p of particles) {
        if (p.alpha <= 0) continue;
        alive++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32; // Gravity
        p.vx *= 0.99; // Air resistance
        p.angle += p.angularVelocity;

        if (p.y > height * 0.4) {
          p.alpha -= 0.012;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sparkle star
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive > 0 && frames < 240) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [trigger, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
};
