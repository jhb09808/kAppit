import type { BusinessCategory, EventCategory, PersonType } from "../lib/types";

/** Line glyphs, 24×24 viewBox, stroke = currentColor. One set for the whole app. */
export const GLYPH: Record<PersonType | EventCategory | BusinessCategory | "check" | "search" | "map" | "events" | "feed" | "plus" | "chat" | "you" | "recenter" | "chevron" | "settings" | "business", string> = {
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
  food_share: '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 0-3 2-3 5s1 4 3 4 3-1 3-4-1-5-3-5zM17 12v9"/>',
  church: '<path d="M12 3v4M10 5h4M6 21V12l6-4 6 4v9M10 21v-5h4v5"/>',
  outdoors: '<path d="M3 20h18M6 20l5-9 3 5 2-3 3 7M9 8a1 1 0 1 0 0-.1"/>',
  business: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>',
  restaurant: '<path d="M5 3v7a3 3 0 0 0 6 0V3M8 3v18M17 3c-2 0-3 2-3 5s1 4 3 4 3-1 3-4-1-5-3-5zM17 12v9"/>',
  grocery: '<path d="M3 4h2l2.5 11h11L21 7H6.5M9 20a1 1 0 1 0 0-.1M17 20a1 1 0 1 0 0-.1"/>',
  bakery: '<path d="M4 14a8 5 0 0 1 16 0v3H4zM4 17h16M8 10c1-2 2-2 3 0M13 10c1-2 2-2 3 0"/>',
  remittance: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M7 12h.01M17 12h.01"/>',
  salon: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.5 15.5M20 20 8.5 8.5"/>',
  other: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>',
  feed: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
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

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  food_share: "Food share", birthday: "Birthday", karaoke: "Karaoke", sports: "Sports", church: "Church", outdoors: "Outdoors", gathering: "Gathering",
};
export const BUSINESS_CATEGORY_LABEL: Record<BusinessCategory, string> = {
  restaurant: "Restaurant", grocery: "Grocery", bakery: "Bakery", remittance: "Remittance", salon: "Salon", other: "Business",
};
