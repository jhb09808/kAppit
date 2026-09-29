import type { Event, MapItem, Meal, Profile, Spot } from "./types";
import { jitter } from "./geo";

/** Chula Vista / National City — where the app is being born. */
export const HOME: [number, number] = [-117.05, 32.63];

const people: Profile[] = [
  { id: "p1", display_name: "Maria R.", photo_url: null, region_ph: "Iloilo", bio: "Just moved from Iloilo for a nursing job. Missing home cooking — who's making sinigang?", primary_type: "new_arrival", open_to_friends: true, open_to_dating: false, is_new_arrival: true, is_verified: true, is_visible: true, approx_lng: -117.099, approx_lat: 32.678 },
  { id: "p2", display_name: "Liza M.", photo_url: null, region_ph: "Iloilo", bio: "Night-shift nurse, weekends free. Looking for kababayan to have merienda with.", primary_type: "cook", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.02, approx_lat: 32.66 },
  { id: "p3", display_name: "Danny C.", photo_url: null, region_ph: "Cebu", bio: "Free until 3. Halo-halo at Seafood City?", primary_type: "free_now", open_to_friends: true, open_to_dating: true, is_new_arrival: false, is_verified: false, is_visible: true, approx_lng: -117.06, approx_lat: 32.652 },
  { id: "p4", display_name: "Josh T.", photo_url: null, region_ph: "Cebu", bio: "Grad student at SDSU. Down to trade recipes or watch the game.", primary_type: "friends", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.03, approx_lat: 32.622 },
  { id: "p5", display_name: "Ate Ana", photo_url: null, region_ph: "Manila", bio: "Been in South Bay 14 years. Ask me anything — DMV, apartments, where the good pandesal is.", primary_type: "ate_kuya", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.08, approx_lat: 32.61 },
];

const meals: Meal[] = [
  { id: "m1", host_id: "p2", dish: "A big pot of sinigang", note: "Made way too much — come through. Bring nothing but yourself. Kids welcome, we eat at 7 sharp.", starts_at: new Date(Date.now() + 3 * 3600e3).toISOString(), seats_total: 6, seats_taken: 2, is_live: true, approx_lng: -117.045, approx_lat: 32.641 },
  { id: "m2", host_id: "p5", dish: "Lumpia rolling party", note: "I roll, you roll, we all eat. 200 pieces before Sunday — help and take some home.", starts_at: new Date(Date.now() + 26 * 3600e3).toISOString(), seats_total: 5, seats_taken: 3, is_live: false, approx_lng: -117.09, approx_lat: 32.605 },
];

const events: Event[] = [
  { id: "e1", host_id: "p5", title: "Karaoke night", kind: "karaoke", description: "Everyone's welcome, nobody's good. Bring a dish if you can; no problem if not.", starts_at: new Date(Date.now() + 4 * 86400e3).toISOString(), venue: "Ate Ana's garage", open_to_everyone: true, rsvp_count: 14, approx_lng: -117.075, approx_lat: 32.617 },
  { id: "e2", host_id: "p4", title: "Pickup basketball", kind: "sports", description: "Sundays at the park. All levels.", starts_at: new Date(Date.now() + 5 * 86400e3).toISOString(), venue: "Eucalyptus Park", open_to_everyone: true, rsvp_count: 9, approx_lng: -117.06, approx_lat: 32.66 },
];

const spots: Spot[] = [
  { id: "s1", name: "Seafood City", category: "grocery", lng: -117.093, lat: 32.663 },
];

export function seedItems(): MapItem[] {
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));
  const items: MapItem[] = [];
  for (const p of people) {
    const j = jitter(p.id, p.approx_lng!, p.approx_lat!);
    items.push({ kind: "person", id: p.id, lng: j.lng, lat: j.lat, data: p });
  }
  for (const m of meals) {
    const j = jitter(m.id, m.approx_lng, m.approx_lat);
    items.push({ kind: "meal", id: m.id, lng: j.lng, lat: j.lat, data: { ...m, host: byId[m.host_id] } });
  }
  for (const e of events) {
    const j = jitter(e.id, e.approx_lng, e.approx_lat);
    items.push({ kind: "event", id: e.id, lng: j.lng, lat: j.lat, data: { ...e, host: byId[e.host_id] } });
  }
  for (const s of spots) items.push({ kind: "spot", id: s.id, lng: s.lng, lat: s.lat, data: s });
  return items;
}
