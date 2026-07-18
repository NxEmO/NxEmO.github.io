"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const NAMES = ["NxEmO", "Whither Studio"];
const TYPE_MS = 110;
const DELETE_MS = 65;
const PAUSE_MS = 3500;
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#$@%&";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export default function TypewriterTitle() {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const [displayed, setDisplayed] = useState(NAMES[0]);
  const [nameIdx, setNameIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [glitching, setGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setCursorOn((visible) => !visible), 520);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const trigger = () => {
      if (isDeleting) return;
      setGlitching(true);
      let ticks = 0;
      const interval = setInterval(() => {
        setGlitchText(
          Array.from({ length: displayed.length }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join("")
        );
        ticks += 1;
        if (ticks > 6) {
          clearInterval(interval);
          setGlitching(false);
          setGlitchText("");
        }
      }, 60);
    };

    const timer = setInterval(trigger, 9000);
    return () => clearInterval(timer);
  }, [displayed, isDeleting, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const target = NAMES[nameIdx];

    if (!isDeleting && displayed === target) {
      const timer = setTimeout(() => setIsDeleting(true), PAUSE_MS);
      return () => clearTimeout(timer);
    }

    if (isDeleting && displayed === "") {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setNameIdx((index) => (index + 1) % NAMES.length);
      }, DELETE_MS);
      return () => clearTimeout(timer);
    }

    const speed = isDeleting ? DELETE_MS : TYPE_MS;
    const timer = setTimeout(() => {
      setDisplayed((previous) =>
        isDeleting ? previous.slice(0, -1) : target.slice(0, previous.length + 1)
      );
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, nameIdx, reducedMotion]);

  const renderText = reducedMotion ? NAMES[0] : glitching ? glitchText : displayed;

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
      {glitching && !reducedMotion ? (
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            aria-hidden="true"
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
          <span
            aria-hidden="true"
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
      ) : (
        <span>{renderText}</span>
      )}
      {!reducedMotion && (
        <span
          aria-hidden="true"
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
      )}
    </h1>
  );
}
