"use client";

import { useEffect, useRef } from "react";

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, frame = 0, last = 0;
    let mouse = { x: -1000, y: -1000 };
    let stars: { x: number; y: number; radius: number; phase: number }[] = [];
    const resize = () => {
      width = innerWidth; height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(180, Math.round(width * height / 6500)) }, () => ({
        x: Math.random() * width, y: Math.random() * height, radius: .6 + Math.random() * 1.1, phase: Math.random() * 6.28,
      }));
    };
    const draw = (now: number) => {
      frame = 0;
      if (document.hidden || motion.matches) return;
      const dt = Math.min((now - last) / 1000, .05); last = now;
      ctx.clearRect(0, 0, width, height);
      const active: { x: number; y: number; distance: number }[] = [];
      for (const star of stars) {
        star.x = (star.x + dt * 2) % width;
        const x = star.x + Math.sin(now * .0001 + star.phase) * 5;
        const y = star.y + Math.cos(now * .00015 + star.phase) * 5;
        const distance = Math.hypot(x - mouse.x, y - mouse.y);
        ctx.fillStyle = `rgba(150,180,220,${.35 + Math.max(0, 1 - distance / 280) * .6})`;
        ctx.beginPath(); ctx.arc(x, y, star.radius, 0, Math.PI * 2); ctx.fill();
        if (distance < 280) active.push({ x, y, distance });
      }
      active.sort((a, b) => a.distance - b.distance);
      const nearby = active.slice(0, 24);
      for (let i = 0; i < nearby.length; i++) {
        const a = nearby[i];
        for (let j = i + 1; j < nearby.length; j++) {
          const b = nearby[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 180) continue;
          ctx.strokeStyle = `rgba(140,170,215,${(1 - distance / 180) * (1 - a.distance / 300) * .55})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !motion.matches) { last = performance.now(); frame = requestAnimationFrame(draw); }
      else ctx.clearRect(0, 0, width, height);
    };
    const move = (event: PointerEvent) => { mouse = { x: event.clientX, y: event.clientY }; };
    const leave = () => { mouse = { x: -1000, y: -1000 }; };
    resize(); sync();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave); document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);
  return <canvas ref={ref} className="star-field" aria-hidden="true" />;
}
