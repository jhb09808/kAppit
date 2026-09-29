import type { EventKind, PersonType } from "../lib/types";

/** Line glyphs, 24×24 viewBox, stroke = currentColor. One set for the whole app. */
export const GLYPH: Record<PersonType | EventKind | "meal" | "spot" | "check" | "search" | "map" | "events" | "plus" | "chat" | "you" | "recenter" | "chevron", string> = {
  new_arrival: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2M3 13h18"/>',
  friends: '<circle cx="9" cy="8" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M2.5 19c0-3.5 3-5.5 6.5-5.5S15.5 15.5 15.5 19M14 14c3 0 5.5 1.5 5.5 4.5"/>',
  dating: '<path d="M12 8c1.4-2.5 4.5-2.5 5.5 0 .8 2-1 4-5.5 8-4.5-4-6.3-6-5.5-8 1-2.5 4.1-2.5 5.5 0z"/>',
  cook: '<path d="M4 11h16l-1.5 8h-13zM12 11V4M9 4h6"/>',
  student: '<path d="M3 9l9-5 9 5-9 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M21 9v5"/>',
  ate_kuya: '<circle cx="12" cy="7" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5M9 4.5c1-1.5 5-1.5 6 0"/>',
  free_now: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2"/>',
  konduktor: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 12h18M8 7V5h8v2"/>',
  birthday: '<path d="M3 12h18v9H3zM12 12V7M8 7h8M10 4h4"/>',
  karaoke: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  sports: '<circle cx="12" cy="12" r="9"/><path d="M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18M3 12h18"/>',
  gathering: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/>',
  meal: '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 0-3 2-3 5s1 4 3 4 3-1 3-4-1-5-3-5zM17 12v9"/>',
  spot: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  map: '<path d="M3 10.5 12 3l9 7.5M5 9v11h14V9"/>',
  events: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M4 5h16v11H8l-4 4V5z"/>',
  you: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  recenter: '<circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  chevron: '<path d="m6 15 6-6 6 6"/>',
};

export function Icon({ name, size = 20, stroke = 2, className, style }: { name: keyof typeof GLYPH; size?: number; stroke?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GLYPH[name] }} />
  );
}

/** The hug mark — two figures, arms interlocked. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="kAppit">
      <g fill="none" strokeWidth="10" strokeLinecap="round">
        <path d="M 56.79 50.16 A 20 20 0 1 1 39.40 37.05" stroke="#6a3fa0" />
        <path d="M 43.23 63.89 A 20 20 0 1 1 60.65 76.95" stroke="#f2a93b" />
      </g>
      <circle cx="42.5" cy="21.5" r="7.5" fill="#6a3fa0" />
      <circle cx="57.5" cy="21.5" r="7.5" fill="#f2a93b" />
    </svg>
  );
}

export function Wordmark({ size = 20 }: { size?: number }) {
  return <span className="wordmark" style={{ fontSize: size }}>k<b>App</b>it</span>;
}

export const PERSON_TYPE_LABEL: Record<PersonType, string> = {
  new_arrival: "New arrival", friends: "Open to friends", dating: "Open to dating", cook: "Loves to cook",
  student: "Student", ate_kuya: "Ate / Kuya", free_now: "Free now", konduktor: "Konduktor",
};
