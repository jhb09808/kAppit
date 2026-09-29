import type { Business, Event, MapItem, Post, Profile } from "./types";
import { jitter } from "./geo";

/** Chula Vista / National City — where the app is being born. */
export const HOME: [number, number] = [-117.07, 32.655];

const h = (hours: number) => new Date(Date.now() + hours * 3600e3).toISOString();

export const people: Profile[] = [
  { id: "p1", display_name: "Maria R.", photo_url: null, region_ph: "Iloilo", bio: "Just moved from Iloilo for a nursing job. Missing home cooking — who's making sinigang?", primary_type: "new_arrival", open_to_friends: true, open_to_dating: false, is_new_arrival: true, is_verified: true, is_visible: true, approx_lng: -117.099, approx_lat: 32.678 },
  { id: "p2", display_name: "Liza M.", photo_url: null, region_ph: "Iloilo", bio: "Night-shift nurse, weekends free. Looking for kababayan to have merienda with.", primary_type: "cook", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.02, approx_lat: 32.66 },
  { id: "p3", display_name: "Danny C.", photo_url: null, region_ph: "Cebu", bio: "Free until 3. Halo-halo at Seafood City?", primary_type: "free_now", open_to_friends: true, open_to_dating: true, is_new_arrival: false, is_verified: false, is_visible: true, approx_lng: -117.06, approx_lat: 32.652 },
  { id: "p4", display_name: "Josh T.", photo_url: null, region_ph: "Cebu", bio: "Grad student at SDSU. Down to trade recipes or watch the game.", primary_type: "friends", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.03, approx_lat: 32.622 },
  { id: "p5", display_name: "Ate Ana", photo_url: null, region_ph: "Manila", bio: "In South Bay 14 years. Ask me anything — DMV, apartments, where the good pandesal is.", primary_type: "ate_kuya", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.08, approx_lat: 32.61 },
  { id: "p6", display_name: "Kuya Ben", photo_url: null, region_ph: "Pampanga", bio: "Hosts a lumpia night every other Saturday. Bring your own containers.", primary_type: "konduktor", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.075, approx_lat: 32.685 },
  { id: "p7", display_name: "Nikki S.", photo_url: null, region_ph: "Davao", bio: "Southwestern College. Trying to find people to study with who also miss durian.", primary_type: "student", open_to_friends: true, open_to_dating: true, is_new_arrival: true, is_verified: false, is_visible: true, approx_lng: -117.005, approx_lat: 32.64 },
  { id: "p8", display_name: "Marco V.", photo_url: null, region_ph: "Batangas", bio: "Navy, stationed here 2 years. Kapeng barako supplier if you ask nicely.", primary_type: "friends", open_to_friends: true, open_to_dating: true, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.095, approx_lat: 32.66 },
  { id: "p9", display_name: "Tita Rose", photo_url: null, region_ph: "Bicol", bio: "Retired. I cook laing and Bicol express for anyone homesick. Just say when.", primary_type: "cook", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -116.99, approx_lat: 32.625 },
  { id: "p10", display_name: "Paolo D.", photo_url: null, region_ph: "Quezon City", bio: "Landed last week. Where do I even start?", primary_type: "new_arrival", open_to_friends: true, open_to_dating: false, is_new_arrival: true, is_verified: false, is_visible: true, approx_lng: -117.05, approx_lat: 32.61 },
  { id: "p11", display_name: "Jen A.", photo_url: null, region_ph: "Cavite", bio: "Free after 5 most days. Karaoke or coffee, either works.", primary_type: "free_now", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.07, approx_lat: 32.635 },
  { id: "p12", display_name: "Kuya Rey", photo_url: null, region_ph: "Ilocos", bio: "Been here since '98. If you need a ride to the DMV or a translator for anything, message me.", primary_type: "ate_kuya", open_to_friends: true, open_to_dating: false, is_new_arrival: false, is_verified: true, is_visible: true, approx_lng: -117.04, approx_lat: 32.598 },
];

export const events: Event[] = [
  { id: "e1", host_id: "p2", category: "food_share", title: "A big pot of sinigang", description: "Made way too much — come through. Bring nothing but yourself. Kids welcome, we eat at 7 sharp.", starts_at: h(3), venue: null, open_to_everyone: true, seats_total: 6, seats_taken: 2, is_live: true, approx_lng: -117.045, approx_lat: 32.641 },
  { id: "e2", host_id: "p6", category: "food_share", title: "Lumpia rolling party", description: "I roll, you roll, we all eat. 200 pieces before Sunday — help and take some home.", starts_at: h(26), venue: null, open_to_everyone: true, seats_total: 5, seats_taken: 3, is_live: false, approx_lng: -117.078, approx_lat: 32.684 },
  { id: "e3", host_id: "p9", category: "food_share", title: "Laing and Bicol express", description: "For the homesick Bicolanos. And everyone else who can handle spice.", starts_at: h(5), venue: null, open_to_everyone: true, seats_total: 8, seats_taken: 8, is_live: true, approx_lng: -116.992, approx_lat: 32.626 },
  { id: "e4", host_id: "p5", category: "karaoke", title: "Karaoke night", description: "Everyone's welcome, nobody's good. Bring a dish if you can; no problem if not.", starts_at: h(96), venue: "Ate Ana's garage", open_to_everyone: true, seats_total: null, seats_taken: 14, is_live: false, approx_lng: -117.082, approx_lat: 32.612 },
  { id: "e5", host_id: "p4", category: "sports", title: "Pickup basketball", description: "Sundays at the park. All levels.", starts_at: h(120), venue: "Eucalyptus Park", open_to_everyone: true, seats_total: null, seats_taken: 9, is_live: false, approx_lng: -117.06, approx_lat: 32.66 },
  { id: "e6", host_id: "p1", category: "birthday", title: "Maria's 26th", description: "Open house, come and go. There will be lechon.", starts_at: h(200), venue: "Otay Ranch", open_to_everyone: true, seats_total: null, seats_taken: 21, is_live: false, approx_lng: -117.0, approx_lat: 32.62 },
  { id: "e7", host_id: "p12", category: "church", title: "Simbang Gabi planning", description: "Getting the dawn-mass rota and the bibingka stand sorted early this year.", starts_at: h(150), venue: "St. Anthony of Padua", open_to_everyone: true, seats_total: null, seats_taken: 12, is_live: false, approx_lng: -117.098, approx_lat: 32.675 },
  { id: "e8", host_id: "p8", category: "outdoors", title: "Sunrise hike, Mother Miguel", description: "Easy loop, 90 minutes. Kapeng barako at the top.", starts_at: h(60), venue: "Mother Miguel Mountain trailhead", open_to_everyone: true, seats_total: null, seats_taken: 6, is_live: false, approx_lng: -116.99, approx_lat: 32.66 },
  { id: "e9", host_id: "p11", category: "gathering", title: "New arrivals coffee", description: "Just landed? Come meet people who did the same thing last year. Starbread señorita bread on us.", starts_at: h(30), venue: "Starbread Bakery, Chula Vista", open_to_everyone: true, seats_total: 10, seats_taken: 4, is_live: false, approx_lng: -117.0898, approx_lat: 32.6301 },
  { id: "e10", host_id: "p3", category: "gathering", title: "Halo-halo at Seafood City", description: "Food court, 3 PM. Look for the guy in the Ginebra jersey.", starts_at: h(2), venue: "Seafood City food court", open_to_everyone: true, seats_total: null, seats_taken: 3, is_live: true, approx_lng: -117.091, approx_lat: 32.675 },
];

export const businesses: Business[] = [
  // Real places, exact coordinates (Google Places, Sept 2026). Businesses are public; exact is fine.
  // — Plaza Blvd corridor, National City: the Filipino main street —
  { id: "b1",  name: "Seafood City Supermarket", category: "grocery",    description: "The unofficial town square. Turon at the bakery; the food court is a low-pressure first meet-up spot.", address: "1420 E Plaza Blvd, National City", hours: "7 AM – 9 PM",  is_filipino_owned: true, lng: -117.09103, lat: 32.67489 },
  { id: "b2",  name: "Jollibee",                 category: "restaurant", description: "Chickenjoy, peach-mango pie, and the same jingle you grew up with.", address: "1401 E Plaza Blvd, National City", hours: "7 AM – 11 PM", is_filipino_owned: true, lng: -117.09168, lat: 32.67721 },
  { id: "b3",  name: "Lisa's Filipino Cuisine",  category: "restaurant", description: "Turo-turo. Point at what you want.", address: "1210 E Plaza Blvd, National City", hours: "8 AM – 8 PM", is_filipino_owned: true, lng: -117.09430, lat: 32.67636 },
  { id: "b4",  name: "Manila Sunset Grille",     category: "restaurant", description: "Sizzling sisig and karaoke on weekends.", address: "925 E Plaza Blvd #111, National City", hours: "11 AM – 9 PM", is_filipino_owned: true, lng: -117.09602, lat: 32.67739 },
  { id: "b5",  name: "Manila Seafood Oriental Market", category: "grocery", description: "Fresh bangus, live crab, and every brand of patis.", address: "2220 E Plaza Blvd, National City", hours: "8 AM – 8 PM", is_filipino_owned: true, lng: -117.08186, lat: 32.67744 },
  { id: "b6",  name: "Valerio's Finest Bake Shop", category: "bakery",   description: "Pandesal at dawn. Ube ensaymada on weekends.", address: "2220 E Plaza Blvd J, National City", hours: "6 AM – 7 PM", is_filipino_owned: true, lng: -117.08191, lat: 32.67737 },
  { id: "b7",  name: "Filipino Desserts Plus",   category: "bakery",     description: "Leche flan, sapin-sapin, cassava cake by the tray.", address: "2220 E Plaza Blvd Ste Q, National City", hours: "9 AM – 7 PM", is_filipino_owned: true, lng: -117.08194, lat: 32.67735 },
  { id: "b8",  name: "Island Pacific Supermarket", category: "grocery",  description: "Big grocery with a hot-food counter. Good lechon kawali.", address: "2720 E Plaza Blvd Ste A, National City", hours: "7 AM – 9 PM", is_filipino_owned: true, lng: -117.07886, lat: 32.68003 },
  { id: "b9",  name: "Tita's Kitchenette",       category: "restaurant", description: "Family-run turo-turo. The kare-kare goes fast.", address: "2720 E Plaza Blvd E, National City", hours: "10 AM – 8 PM", is_filipino_owned: true, lng: -117.07836, lat: 32.68007 },
  { id: "b10", name: "Valerio's Bake Shop",      category: "bakery",     description: "The Plaza Blvd branch. Spanish bread, hopia, mamon.", address: "2720 E Plaza Blvd Ste H, National City", hours: "6 AM – 7 PM", is_filipino_owned: true, lng: -117.07825, lat: 32.68019 },
  { id: "b11", name: "Jax Chibugan",             category: "restaurant", description: "Silog plates all day. Cheap, fast, packed at lunch.", address: "3142 E Plaza Blvd Ste F, National City", hours: "7 AM – 8 PM", is_filipino_owned: true, lng: -117.07228, lat: 32.68252 },
  { id: "b12", name: "Salies Place",             category: "bakery",     description: "Small bakery, big following. Get the ube pandesal.", address: "3403 E Plaza Blvd A1, National City", hours: "7 AM – 5 PM", is_filipino_owned: true, lng: -117.07143, lat: 32.68441 },
  { id: "b13", name: "Lola Happy Bistro",        category: "restaurant", description: "Comfort food, lola-style portions.", address: "3421 E Plaza Blvd, National City", hours: "10 AM – 8 PM", is_filipino_owned: true, lng: -117.07109, lat: 32.68510 },
  { id: "b14", name: "Kujo Eats",                category: "restaurant", description: "Modern Filipino. Date-night friendly.", address: "3400 E 8th St Ste 115, National City", hours: "11 AM – 9 PM", is_filipino_owned: true, lng: -117.07183, lat: 32.68515 },
  { id: "b15", name: "Manila Bistro",            category: "restaurant", description: "Sit-down Filipino with a full menu.", address: "933 S Harbison Ave, National City", hours: "11 AM – 9 PM", is_filipino_owned: true, lng: -117.07404, lat: 32.68345 },
  { id: "b16", name: "Valerio's 1979",           category: "bakery",     description: "The original. Since 1979.", address: "1631 E 8th St #1, National City", hours: "6 AM – 7 PM", is_filipino_owned: true, lng: -117.08990, lat: 32.68090 },
  // — E 8th St, National City —
  { id: "b17", name: "Villa Manila",             category: "restaurant", description: "Old-school. Crispy pata and halo-halo.", address: "500 E 8th St, National City", hours: "10 AM – 9 PM", is_filipino_owned: true, lng: -117.10157, lat: 32.67712 },
  { id: "b18", name: "Fiesta Pinoy",             category: "restaurant", description: "Party trays and catering for your next salu-salo.", address: "550 E 8th St #9, National City", hours: "9 AM – 8 PM", is_filipino_owned: true, lng: -117.10095, lat: 32.67691 },
  { id: "b19", name: "Zarlitos Family Restaurant", category: "restaurant", description: "Breakfast silogs, big portions.", address: "505 E 8th St, National City", hours: "7 AM – 8 PM", is_filipino_owned: true, lng: -117.10152, lat: 32.67763 },
  // — Chula Vista —
  { id: "b20", name: "Seafood City Supermarket", category: "grocery",    description: "The Chula Vista branch on Orange Ave.", address: "285 E Orange Ave, Chula Vista", hours: "7 AM – 9 PM", is_filipino_owned: true, lng: -117.04093, lat: 32.60511 },
  { id: "b21", name: "Jochi Resto Grill",        category: "restaurant", description: "Grilled everything. Inihaw na liempo is the move.", address: "289 E Orange Ave, Chula Vista", hours: "10 AM – 9 PM", is_filipino_owned: true, lng: -117.04006, lat: 32.60526 },
  { id: "b22", name: "Starbread Bakery",         category: "bakery",     description: "Señorita bread, still warm, by the dozen.", address: "520 Broadway #2, Chula Vista", hours: "7 AM – 8 PM", is_filipino_owned: true, lng: -117.08981, lat: 32.63015 },
  { id: "b23", name: "JNC Pinoy Foodmart",       category: "grocery",    description: "Otay Lakes grocery with a cooked-food counter.", address: "943 Otay Lakes Rd #D, Chula Vista", hours: "8 AM – 8 PM", is_filipino_owned: true, lng: -116.99299, lat: 32.64159 },
  { id: "b24", name: "Halo Halo Cafe",           category: "restaurant", description: "Halo-halo, of course, plus silogs and merienda.", address: "1392 E Palomar St #303, Chula Vista", hours: "9 AM – 8 PM", is_filipino_owned: true, lng: -116.99720, lat: 32.62336 },
  { id: "b25", name: "Pansang's Filipino Cuisine", category: "restaurant", description: "Eastlake's Filipino spot. Good for groups.", address: "2260 Otay Lakes Rd #103, Chula Vista", hours: "10 AM – 8 PM", is_filipino_owned: true, lng: -116.96569, lat: 32.64669 },
  { id: "b26", name: "EsKiNiTa",                 category: "restaurant", description: "Tiny, loved, 4.9 stars. Go before it gets discovered.", address: "1840 Coronado Ave, San Diego", hours: "11 AM – 8 PM", is_filipino_owned: true, lng: -117.09417, lat: 32.57725 },
];

export const posts: Post[] = [
  { id: "x1", author_id: "p2", body: "Sinigang tonight, 4 seats left. Sakay na 🍲", media: [{ type: "image", url: "https://picsum.photos/seed/sinigang/900/700", alt: "A pot of sinigang" }], link: null, event_id: "e1", business_id: null, kapit_count: 12, reply_count: 4, created_at: h(-1) },
  { id: "x2", author_id: "p5", body: "Valerio's has ube ensaymada again. Go early.", media: [{ type: "image", url: "https://picsum.photos/seed/ensaymada1/900/900" }, { type: "image", url: "https://picsum.photos/seed/ensaymada2/900/900" }], link: null, event_id: null, business_id: "b6", kapit_count: 31, reply_count: 9, created_at: h(-5) },
  { id: "x3", author_id: "p1", body: "First week in Chula Vista. Anyone from Iloilo around? Miss batchoy so much.", media: [], link: null, event_id: null, business_id: null, kapit_count: 18, reply_count: 11, created_at: h(-9) },
  { id: "x4", author_id: "p3", body: "This is exactly how my lola made lumpia. Watch the fold.", media: [], link: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "How to roll lumpia the Kapampangan way", description: "Tight, thin, no air pockets. 6 minutes.", image: "https://picsum.photos/seed/lumpiavid/1200/630", site: "youtube.com" }, event_id: null, business_id: null, kapit_count: 44, reply_count: 6, created_at: h(-14) },
  { id: "x5", author_id: "p4", body: "Basketball Sunday is on. 9 so far. Come through even if you're bad.", media: [{ type: "video", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://picsum.photos/seed/hoops/900/600" }], link: null, event_id: "e5", business_id: null, kapit_count: 7, reply_count: 2, created_at: h(-20) },
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
