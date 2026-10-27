"use client";

import { useEffect, useRef } from "react";
import { createWaterRenderer, RipplePool, WaterClock } from "@/lib/water-renderer";

export default function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const image = new Image();
    const ripples = new RipplePool();
    const clock = new WaterClock();
    let renderer: ReturnType<typeof createWaterRenderer> = null;
    let frame = 0;
    let nextDrop = 1.8;
    let lastMove = 0;
    let lastX = -1000;
    let lastY = -1000;
    let disposed = false;
    let lost = false;
    let failed = false;
    let width = 1;
    let height = 1;

    const enabled = () => !disposed && !lost && !failed && !document.hidden &&
      !reducedMotion.matches && document.documentElement.dataset.water !== "off";

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      // Bound fill-rate on high-DPI displays and keep mobile rendering inexpensive.
      const ratio = Math.min(window.devicePixelRatio || 1, coarsePointer.matches ? 1 : 1.5, Math.sqrt(2_400_000 / (width * height)));
      renderer?.resize(width, height, ratio);
      ripples.clear();
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      clock.pause();
      canvas.dataset.ready = "false";
    };

    const tick = (now: number) => {
      frame = 0;
      if (!enabled() || !renderer) { stop(); return; }
      const simulationTime = clock.step(now, coarsePointer.matches ? 30 : 60);
      if (simulationTime === null) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (simulationTime >= nextDrop) {
        const rain = document.documentElement.dataset.rain === "on";
        ripples.add(width * (0.08 + Math.random() * 0.84), height * (0.12 + Math.random() * 0.62), simulationTime, rain ? 0.9 : 0.65);
        nextDrop = simulationTime + (rain ? 0.55 : 3.2);
      }
      renderer.render(simulationTime, ripples.values);
      canvas.dataset.ready = "true";
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (!enabled()) { stop(); return; }
      if (!image.complete || !image.naturalWidth) return;
      if (!renderer) {
        renderer = createWaterRenderer(canvas, image);
        if (!renderer) { failed = true; stop(); return; }
        resize();
        ripples.add(width * 0.65, height * 0.38, clock.time, 1.1);
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const pointerMove = (event: PointerEvent) => {
      if (!enabled() || !renderer || event.pointerType === "touch") return;
      if (clock.time - lastMove < 0.12 || Math.hypot(event.clientX - lastX, event.clientY - lastY) < 20) return;
      ripples.add(event.clientX, event.clientY, clock.time, 0.5);
      lastMove = clock.time;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const pointerDown = (event: PointerEvent) => {
      if (enabled() && renderer) ripples.add(event.clientX, event.clientY, clock.time, 1.6);
    };

    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stop();
      renderer?.dispose();
      renderer = null;
    };
    const contextRestored = () => { lost = false; failed = false; sync(); };

    image.onload = sync;
    image.src = "/back.jpg";
    window.addEventListener("appearance-change", sync);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerdown", pointerDown, { passive: true });
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    sync();

    return () => {
      disposed = true;
      stop();
      image.onload = null;
      window.removeEventListener("appearance-change", sync);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      renderer?.dispose();
    };
  }, []);

  return <div className="water-background" aria-hidden="true"><canvas ref={canvasRef} data-ready="false" /></div>;
}
