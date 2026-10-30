"use client";

import { useEffect, useRef } from "react";
import { buildConstellations, distributeStars } from "../lib/constellations";

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, frame = 0, last = 0;
    let mouse = { x: -1000, y: -1000 };
    let links: [number, number][] = [];
    let visibility: number[] = [];
    let stars: { x: number; y: number; radius: number; phase: number }[] = [];
    const resize = () => {
      width = innerWidth; height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = distributeStars(width, height).map(point => ({
        ...point, radius: 1.1 + Math.random() * 1.3, phase: Math.random() * 6.28,
      }));
      links = buildConstellations(stars);
      visibility = links.map(() => 0);
    };
    const draw = (now: number) => {
      frame = 0;
      if (document.hidden || motion.matches) return;
      const dt = Math.min((now - last) / 1000, .05); last = now;
      ctx.clearRect(0, 0, width, height);
      const active: { x: number; y: number; distance: number }[] = [];
      for (const star of stars) {
        star.phase += dt * .02;
        const x = star.x + Math.sin(now * .0001) * 5;
        const y = star.y + Math.cos(now * .00015) * 5;
        const distance = Math.hypot(x - mouse.x, y - mouse.y);
        ctx.shadowColor = "rgba(55,70,110,.75)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = `rgba(255,255,255,${.72 + Math.max(0, 1 - distance / 320) * .28})`;
        ctx.beginPath(); ctx.arc(x, y, star.radius, 0, Math.PI * 2); ctx.fill();
        active.push({ x, y, distance });
      }
      ctx.shadowColor = "rgba(55,70,110,.35)";
      ctx.shadowBlur = 2;
      ctx.lineCap = "round";
      for (let index = 0; index < links.length; index++) {
        const [i, j] = links[index];
        const a = active[i];
        const b = active[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const proximity = Math.max(0, 1 - Math.min(a.distance, b.distance) / 340);
        const smooth = proximity * proximity * (3 - 2 * proximity);
        // Ease in and linger after the pointer leaves, with a slow, staggered shimmer.
        visibility[index] += (smooth - visibility[index]) * (1 - Math.exp(-dt / .65));
        const shimmer = .5 + .5 * Math.sin(now * .00065 + stars[i].phase);
        const alpha = (.04 + shimmer * .045 + visibility[index] * .58) * (1 - distance / 320);
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        gradient.addColorStop(0, `rgba(255,255,255,${alpha * .35})`);
        gradient.addColorStop(.5, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(1, `rgba(255,255,255,${alpha * .35})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = .9;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
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
    window.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave); document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);
  return <canvas ref={ref} className="star-field" aria-hidden="true" />;
}
