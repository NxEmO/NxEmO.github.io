"use client";

import { useEffect, useState } from "react";

const NAMES = ["Land1ngW", "王若淼", "Ruomiao Wang"];
const TYPE_MS = 110;
const DELETE_MS = 65;
const PAUSE_MS = 3500;

export default function TypewriterTitle() {
  const [displayed, setDisplayed] = useState("Land1ngW");
  const [nameIdx, setNameIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  // cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn((v) => !v), 520);
    return () => clearInterval(t);
  }, []);

  // typing logic
  useEffect(() => {
    const target = NAMES[nameIdx];

    if (!isDeleting && displayed === target) {
      const t = setTimeout(() => setIsDeleting(true), PAUSE_MS);
      return () => clearTimeout(t);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setNameIdx((i) => (i + 1) % NAMES.length);
      return;
    }

    const speed = isDeleting ? DELETE_MS : TYPE_MS;
    const t = setTimeout(() => {
      setDisplayed((prev) =>
        isDeleting ? prev.slice(0, -1) : target.slice(0, prev.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, nameIdx]);

  return (
    <h1
      style={{
        fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
        marginBottom: 14,
        fontFamily: "var(--mono)",
        minHeight: "1.2em",
      }}
    >
      {/* highlight the "1" only when showing Land1ngW */}
      {nameIdx === 0 || (nameIdx > 0 && isDeleting) ? (
        <>
          {displayed.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                color:
                  ch === "1" && displayed.startsWith("Land")
                    ? "var(--accent)"
                    : "inherit",
                textShadow:
                  ch === "1" && displayed.startsWith("Land")
                    ? "0 0 20px rgba(96,165,250,0.4)"
                    : "none",
              }}
            >
              {ch}
            </span>
          ))}
        </>
      ) : (
        <span>{displayed}</span>
      )}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: "0.85em",
          background: "var(--accent)",
          marginLeft: 3,
          verticalAlign: "middle",
          opacity: cursorOn ? 1 : 0,
          borderRadius: 1,
          transition: "opacity 0.08s",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
    </h1>
  );
}
