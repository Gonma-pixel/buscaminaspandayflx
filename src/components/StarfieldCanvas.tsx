import { useEffect, useRef } from 'react';
import type { Particle } from '../types/game';

interface StarfieldCanvasProps {
  burstTrigger?: { x: number; y: number; type: 'explosion' | 'victory' } | null;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  speedY: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function StarfieldCanvas({ burstTrigger }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Initialize stars once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    const initStars = (width: number, height: number) => {
      const starCount = Math.floor((width * height) / 3200);
      const colors = ['#ffffff', '#bae6fd', '#e0e7ff', '#fef08a', '#c7d2fe'];
      const newStars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const radius = Math.random() < 0.85 ? Math.random() * 1.2 + 0.3 : Math.random() * 2.0 + 1.2;
        const baseAlpha = Math.random() * 0.7 + 0.2;
        newStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 2.0 + 0.5,
          twinklePhase: Math.random() * Math.PI * 2,
          speedY: (Math.random() * 0.15 + 0.05) * (radius > 1.2 ? 1.4 : 0.8),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      starsRef.current = newStars;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle particle burst from props
  useEffect(() => {
    if (!burstTrigger || !canvasRef.current) return;
    const { x, y, type } = burstTrigger;
    const count = type === 'explosion' ? 70 : 80;
    const colors =
      type === 'explosion'
        ? ['#ef4444', '#f97316', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff']
        : ['#38bdf8', '#34d399', '#a78bfa', '#f472b6', '#38bdf8', '#facc15'];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 2;
      const maxLife = Math.random() * 50 + 40;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        maxLife,
        life: 0,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, [burstTrigger]);

  // Main 60fps Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = (time: number) => {
      if (!running) return;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      const w = canvas.width;
      const h = canvas.height;

      // Background clearing with cosmic fade
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Subtle Nebula Clouds
      const gradient1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 20, w * 0.2, h * 0.3, w * 0.45);
      gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.045)');
      gradient1.addColorStop(0.6, 'rgba(99, 102, 241, 0.02)');
      gradient1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, w, h);

      const gradient2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 40, w * 0.8, h * 0.7, w * 0.5);
      gradient2.addColorStop(0, 'rgba(168, 85, 247, 0.04)');
      gradient2.addColorStop(0.5, 'rgba(236, 72, 153, 0.015)');
      gradient2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);

      // Render Stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += star.speedY * (dt * 60);
        if (star.y > h) star.y = 0;

        star.twinklePhase += star.twinkleSpeed * dt;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
        const finalAlpha = Math.max(0.1, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = finalAlpha;
        ctx.fill();

        // Extra twinkle cross on larger stars
        if (star.radius > 1.6 && finalAlpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 2.2, star.y);
          ctx.lineTo(star.x + star.radius * 2.2, star.y);
          ctx.moveTo(star.x, star.y - star.radius * 2.2);
          ctx.lineTo(star.x, star.y + star.radius * 2.2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Occasional Shooting Star spawn
      if (Math.random() < 0.008 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 14 + 10,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          life: 0,
          maxLife: Math.random() * 35 + 25,
        });
      }

      // Render Shooting Stars
      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - ss.life / ss.maxLife;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(186, 230, 253, ${ss.opacity * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      // Render Particles (Explosions / Victory Sparkles)
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt * 60;
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - (p.life / p.maxLife) * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.life >= p.maxLife || p.alpha <= 0.01) {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
}
