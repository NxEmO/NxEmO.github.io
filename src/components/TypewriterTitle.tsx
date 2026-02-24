"use client";

import { useEffect, useState } from "react";

const NAMES = ["Land1ngW", "王若淼", "Ruomiao Wang"];
const TYPE_MS = 110;
const DELETE_MS = 65;
const PAUSE_MS = 3500;
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#$@%&";

export default function TypewriterTitle() {
  const [displayed, setDisplayed] = useState("Land1ngW");
  const [nameIdx, setNameIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [glitching, setGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  // cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn((v) => !v), 520);
    return () => clearInterval(t);
  }, []);

  // periodic glitch — triggers every ~9s, only when not typing/deleting
  useEffect(() => {
    const trigger = () => {
      if (isDeleting) return;
      setGlitching(true);
      let ticks = 0;
      const iv = setInterval(() => {
        setGlitchText(
          Array.from({ length: displayed.length }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join("")
        );
        ticks++;
        if (ticks > 6) {
          clearInterval(iv);
          setGlitching(false);
          setGlitchText("");
        }
      }, 60);
    };
    const t = setInterval(trigger, 9000);
    return () => clearInterval(t);
  }, [displayed, isDeleting]);

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

  const renderText = glitching ? glitchText : displayed;
  const isLand = displayed.startsWith("Land") && nameIdx === 0;

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
        position: "relative",
      }}
    >
      {glitching ? (
        /* glitch layers */
        <span style={{ position: "relative", display: "inline-block" }}>
          {/* red channel shift */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              color: "rgba(255,60,60,0.7)",
              transform: "translate(-3px, 1px)",
              clipPath: "inset(20% 0 50% 0)",
            }}
          >
            {renderText}
          </span>
          {/* cyan channel shift */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              color: "rgba(0,220,220,0.7)",
              transform: "translate(3px, -1px)",
              clipPath: "inset(55% 0 20% 0)",
            }}
          >
            {renderText}
          </span>
          <span style={{ color: "var(--text-1)" }}>{renderText}</span>
        </span>
      ) : isLand ? (
        <>
          {displayed.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                color: ch === "1" ? "var(--accent)" : "inherit",
                textShadow:
                  ch === "1" ? "0 0 20px rgba(96,165,250,0.4)" : "none",
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
