"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  /** 是否在挂载时立即触发（用于首屏元素） */
  immediate?: boolean;
  style?: React.CSSProperties;
}

export default function FadeUp({
  children,
  delay = 0,
  immediate = false,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [immediate, delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${immediate ? 0 : delay}ms, transform 0.55s ease ${immediate ? 0 : delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
