import type { Business, Event, MapItem, Post, Profile } from "./types";
import { jitter } from "./geo";

/** Chula Vista / National City — where the app is being born. */
export const HOME: [number, number] = [-117.05, 32.63];

const h = (hours: number) => new Date(Date.now() + hours * 3600e3).toISOString();

export const people: Profile[] = [
  { id: "p1", display_name: "Maria R.", photo_url: null, region_ph: "Iloilo", bio: "Just moved from Iloilo for a nursing job. Missing home cooking — who's making sinigang?", primary_type: "new_arrival", open_to_friends: true, open_to_dating: false, is_new_arrival: true, is_verified: true, is_visible: true, approx_lng: -117.099, approx_lat: 32.678 },
  { id: "p2", display_name: "Liza M.", photo_url: null, region_ph: "Iloilo", bio: "Night-shift nurse, weekends free. Looking for kababayan to have merienda with.", primary_type: "cook", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.02, approx_lat: 32.66 },
  { id: "p3", display_name: "Danny C.", photo_url: null, region_ph: "Cebu", bio: "Free until 3. Halo-halo at Seafood City?", primary_type: "free_now", open_to_friends: true, open_to_dating: true, is_new_arrival: false, is_verified: false, is_visible: true, approx_lng: -117.06, approx_lat: 32.652 },
  { id: "p4", display_name: "Josh T.", photo_url: null, region_ph: "Cebu", bio: "Grad student at SDSU. Down to trade recipes or watch the game.", primary_type: "friends", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.03, approx_lat: 32.622 },
  { id: "p5", display_name: "Ate Ana", photo_url: null, region_ph: "Manila", bio: "In South Bay 14 years. Ask me anything — DMV, apartments, where the good pandesal is.", primary_type: "ate_kuya", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.08, approx_lat: 32.61 },
];

export const events: Event[] = [
  { id: "e1", host_id: "p2", category: "food_share", title: "A big pot of sinigang", description: "Made way too much — come through. Bring nothing but yourself. Kids welcome, we eat at 7 sharp.", starts_at: h(3), venue: null, open_to_everyone: true, seats_total: 6, seats_taken: 2, is_live: true, approx_lng: -117.045, approx_lat: 32.641 },
  { id: "e2", host_id: "p5", category: "food_share", title: "Lumpia rolling party", description: "I roll, you roll, we all eat. 200 pieces before Sunday — help and take some home.", starts_at: h(26), venue: null, open_to_everyone: true, seats_total: 5, seats_taken: 3, is_live: false, approx_lng: -117.09, approx_lat: 32.605 },
  { id: "e3", host_id: "p5", category: "karaoke", title: "Karaoke night", description: "Everyone's welcome, nobody's good. Bring a dish if you can; no problem if not.", starts_at: h(96), venue: "Ate Ana's garage", open_to_everyone: true, seats_total: null, seats_taken: 14, is_live: false, approx_lng: -117.075, approx_lat: 32.617 },
  { id: "e4", host_id: "p4", category: "sports", title: "Pickup basketball", description: "Sundays at the park. All levels.", starts_at: h(120), venue: "Eucalyptus Park", open_to_everyone: true, seats_total: null, seats_taken: 9, is_live: false, approx_lng: -117.06, approx_lat: 32.66 },
  { id: "e5", host_id: "p1", category: "birthday", title: "Maria's 26th", description: "Open house, come and go. There will be lechon.", starts_at: h(200), venue: "Otay Ranch", open_to_everyone: true, seats_total: null, seats_taken: 21, is_live: false, approx_lng: -117.0, approx_lat: 32.62 },
];

export const businesses: Business[] = [
  { id: "b1", name: "Seafood City", category: "grocery", description: "The unofficial town square. Turon at the bakery; the food court is a low-pressure first meet-up spot.", address: "1420 E Plaza Blvd, National City", hours: "7 AM – 9 PM", is_filipino_owned: true, lng: -117.093, lat: 32.663 },
  { id: "b2", name: "Tita's Kitchenette", category: "restaurant", description: "Turo-turo. Point at what you want. The kare-kare goes fast.", address: "National City", hours: "10 AM – 8 PM", is_filipino_owned: true, lng: -117.098, lat: 32.672 },
  { id: "b3", name: "Valerio's Bakery", category: "bakery", description: "Pandesal at 6 AM. Ube ensaymada on weekends.", address: "Chula Vista", hours: "6 AM – 6 PM", is_filipino_owned: true, lng: -117.04, lat: 32.618 },
];

export const posts: Post[] = [
  { id: "x1", author_id: "p2", body: "Sinigang tonight, 4 seats left. Sakay na 🍲", media: [{ type: "image", url: "https://picsum.photos/seed/sinigang/900/700", alt: "A pot of sinigang" }], link: null, event_id: "e1", business_id: null, kapit_count: 12, reply_count: 4, created_at: h(-1) },
  { id: "x2", author_id: "p5", body: "Valerio's has ube ensaymada again. Go early.", media: [{ type: "image", url: "https://picsum.photos/seed/ensaymada1/900/900" }, { type: "image", url: "https://picsum.photos/seed/ensaymada2/900/900" }], link: null, event_id: null, business_id: "b3", kapit_count: 31, reply_count: 9, created_at: h(-5) },
  { id: "x3", author_id: "p1", body: "First week in Chula Vista. Anyone from Iloilo around? Miss batchoy so much.", media: [], link: null, event_id: null, business_id: null, kapit_count: 18, reply_count: 11, created_at: h(-9) },
  { id: "x4", author_id: "p3", body: "This is exactly how my lola made lumpia. Watch the fold.", media: [], link: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "How to roll lumpia the Kapampangan way", description: "Tight, thin, no air pockets. 6 minutes.", image: "https://picsum.photos/seed/lumpiavid/1200/630", site: "youtube.com" }, event_id: null, business_id: null, kapit_count: 44, reply_count: 6, created_at: h(-14) },
  { id: "x5", author_id: "p4", body: "Basketball Sunday is on. 9 so far. Come through even if you're bad.", media: [{ type: "video", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://picsum.photos/seed/hoops/900/600" }], link: null, event_id: "e4", business_id: null, kapit_count: 7, reply_count: 2, created_at: h(-20) },
  { id: "x6", author_id: "p5", body: "PSA for new arrivals: the DMV on Broadway is way faster than the one downtown. Bring two proofs of address.", media: [], link: { url: "https://www.dmv.ca.gov/portal/", title: "California DMV — Appointments", site: "dmv.ca.gov" }, event_id: null, business_id: null, kapit_count: 63, reply_count: 15, created_at: h(-30) },
];

export function seedItems(): MapItem[] {
  const items: MapItem[] = [];
  for (const p of people) {
    const j = jitter(p.id, p.approx_lng!, p.approx_lat!);
    items.push({ kind: "person", id: p.id, lng: j.lng, lat: j.lat, data: p });
  }
  for (const e of events) {
    const j = jitter(e.id, e.approx_lng, e.approx_lat);
    items.push({ kind: "event", id: e.id, lng: j.lng, lat: j.lat, data: { ...e, host: byId(e.host_id) } });
  }
  for (const b of businesses) items.push({ kind: "business", id: b.id, lng: b.lng, lat: b.lat, data: b });
  return items;
}

export function byId(id: string): Profile | undefined { return people.find((p) => p.id === id); }
