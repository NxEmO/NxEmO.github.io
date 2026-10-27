import type { ReactNode } from "react";

export type IconName = "home" | "book" | "github" | "mail" | "sun" | "moon" | "auto" | "glass" | "rain" | "water" | "arrow" | "spark";
const paths: Record<IconName, ReactNode> = {
  water: <path d="M2 6c3-4 7 4 10 0s7 4 10 0M2 12c3-4 7 4 10 0s7 4 10 0M2 18c3-4 7 4 10 0s7 4 10 0" />,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" /><path d="M9 21v-8h6v8" /></>,
  book: <><path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z" /></>,
  github: <path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .2-2-1-3 4-.4 7-2 7-6 0-2-1-3-2-4 .4-1 .5-2 0-3-2 0-3 1-4 2a13 13 0 0 0-6 0C8 3 7 2 5 2c-.5 1-.4 2 0 3-1 1-2 2-2 4 0 4 3 5.6 7 6-1 1-1 2-1 3v4" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z" />,
  auto: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" /></>,
  glass: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="m7 13 6-6m-4 10 8-8m-4 8 4-4" /></>,
  rain: <path d="M7 14H6a4 4 0 1 1 .8-7.9A6 6 0 0 1 18 7a3.5 3.5 0 0 1 0 7h-1M9 14l-2 5m7-5-2 5m7-1-1 3" />,
  arrow: <path d="M7 17 17 7M7 7h10v10" />,
  spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
};

export default function Icon({ name }: { name: IconName }) {
  return <svg className="icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
