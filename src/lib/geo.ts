/**
 * Location privacy.
 *
 * Every person, meal and event is shown at an APPROXIMATE position: a random offset
 * of roughly 200–400 m from the real coordinate. The offset is derived from the record
 * id, so it is stable across renders and reloads — a pin that wandered between
 * refreshes could be averaged back to the real spot. Exact coordinates never reach
 * the client for people; for meals and events they are released only to guests the
 * konduktor has confirmed.
 *
 * In production this jitter runs server-side (Postgres function); this client copy
 * exists so seed/dev data behaves the same way.
 */

const MIN_M = 200;
const MAX_M = 400;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function jitter(id: string, lng: number, lat: number): { lng: number; lat: number } {
  const h = hash(id);
  const angle = ((h % 3600) / 3600) * Math.PI * 2;
  const dist = MIN_M + ((h >>> 12) % (MAX_M - MIN_M));
  const dLat = (dist * Math.cos(angle)) / 111_320;
  const dLng = (dist * Math.sin(angle)) / (111_320 * Math.cos((lat * Math.PI) / 180));
  return { lng: lng + dLng, lat: lat + dLat };
}

/** Distance in miles between two coordinates. */
export function milesBetween(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
