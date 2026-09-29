import { useSyncExternalStore } from "react";

/** User settings that live on the device until auth + Supabase profile sync exist. */
export interface Settings {
  visible: boolean;          // appear on the map for others
  askedVisibility: boolean;  // the one-time prompt was answered
  openToFriends: boolean;
  openToDating: boolean;     // also unlocks seeing others' dating badge
  blocked: string[];         // user ids
  premium: boolean;
}

const KEY = "kappit.settings";
const DEFAULTS: Settings = { visible: false, askedVisibility: false, openToFriends: true, openToDating: false, blocked: [], premium: false };

let state: Settings = (() => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return DEFAULTS; } })();
const subs = new Set<() => void>();

function set(patch: Partial<Settings>) {
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
  subs.forEach((f) => f());
}

export function useSettings() {
  const settings = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => state);
  return { settings, update: set };
}
